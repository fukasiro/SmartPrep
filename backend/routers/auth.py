from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from email_utils import send_verification_email, send_password_reset_email
from models import PendingSignup, PasswordReset, User
from schemas import LoginRequest, SignUpRequest, VerifySignupRequest, PasswordResetRequest, PasswordResetConfirmRequest
from security import create_access_token, generate_verification_code, hash_password, verify_password

router = APIRouter()


@router.post("/signup")
def signup(request: SignUpRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(status_code=400, detail='そのメールアドレスは既に登録済みです。')

    pending = db.query(PendingSignup).filter(PendingSignup.email == request.email).first()
    if pending:
        db.delete(pending)
        db.commit()

    password_hash, password_salt = hash_password(request.password)
    verification_code = generate_verification_code()
    expires_at = datetime.utcnow() + timedelta(minutes=30)

    pending = PendingSignup(
        email=request.email,
        name=request.name,
        password_hash=password_hash,
        password_salt=password_salt,
        verification_code=verification_code,
        expires_at=expires_at,
    )
    db.add(pending)
    db.commit()
    db.refresh(pending)

    send_verification_email(request.email, verification_code)

    return {"message": "認証コードを送信しました。メールに届いたコードを入力してください。", "email": request.email}


@router.post("/verify-signup")
def verify_signup(request: VerifySignupRequest, db: Session = Depends(get_db)):
    pending = db.query(PendingSignup).filter(PendingSignup.email == request.email).first()
    if not pending:
        raise HTTPException(status_code=404, detail='認証待ちのアカウントが見つかりません。')

    if pending.expires_at and pending.expires_at < datetime.utcnow():
        db.delete(pending)
        db.commit()
        raise HTTPException(status_code=410, detail='認証コードの有効期限が切れました。もう一度登録を行ってください。')

    if pending.verification_code != request.code:
        raise HTTPException(status_code=401, detail='認証コードが正しくありません。')

    existing = db.query(User).filter(User.email == pending.email).first()
    if existing:
        db.delete(pending)
        db.commit()
        raise HTTPException(status_code=400, detail='既に登録済みのアカウントです。')

    user = User(
        email=pending.email,
        password_hash=pending.password_hash,
        password_salt=pending.password_salt,
        name=pending.name,
    )
    db.add(user)
    db.delete(pending)
    db.commit()
    db.refresh(user)
    return {
        "message": "アカウントを作成しました。ログインできます。",
        "email": user.email,
        "name": user.name,
        "access_token": create_access_token(str(user.id)),
        "token_type": "bearer",
    }


@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=401, detail='ユーザーが存在しません。')

    if not user.password_hash or not user.password_salt:
        raise HTTPException(status_code=401, detail='パスワードが設定されていません。')

    if not verify_password(request.password, user.password_hash, user.password_salt):
        raise HTTPException(status_code=401, detail='パスワードが正しくありません。')

    return {
        "message": "ログイン成功",
        "email": user.email,
        "name": user.name,
        "access_token": create_access_token(str(user.id)),
        "token_type": "bearer",
    }


@router.post("/password-reset/request")
def request_password_reset(request: PasswordResetRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail='ユーザーが存在しません。')

    reset_code = generate_verification_code()
    expires_at = datetime.utcnow() + timedelta(minutes=30)

    existing = db.query(PasswordReset).filter(PasswordReset.email == request.email).first()
    if existing:
        db.delete(existing)
        db.commit()

    reset = PasswordReset(
        email=request.email,
        reset_code=reset_code,
        expires_at=expires_at,
    )
    db.add(reset)
    db.commit()
    db.refresh(reset)

    send_password_reset_email(request.email, reset_code)

    return {"message": "パスワードリセット用のコードを送信しました。"}


@router.post("/password-reset/confirm")
def confirm_password_reset(request: PasswordResetConfirmRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail='ユーザーが存在しません。')

    reset = db.query(PasswordReset).filter(PasswordReset.email == request.email).first()
    if not reset:
        raise HTTPException(status_code=404, detail='リセットコードが見つかりません。')

    if reset.reset_code != request.code:
        raise HTTPException(status_code=401, detail='コードが正しくありません。')

    if reset.expires_at and reset.expires_at < datetime.utcnow():
        db.delete(reset)
        db.commit()
        raise HTTPException(status_code=410, detail='コードの有効期限が切れました。')

    password_hash, password_salt = hash_password(request.new_password)
    user.password_hash = password_hash
    user.password_salt = password_salt
    db.delete(reset)
    db.commit()

    return {"message": "パスワードを再設定しました。"}
