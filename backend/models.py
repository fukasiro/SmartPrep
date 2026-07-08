from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=True)
    password_hash = Column(String, nullable=True)
    password_salt = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class PendingSignup(Base):
    __tablename__ = "pending_signups"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)
    password = Column(String, nullable=True)
    password_hash = Column(String, nullable=True)
    password_salt = Column(String, nullable=True)
    verification_code = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=True)


class PasswordReset(Base):
    __tablename__ = "password_resets"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True, nullable=False)
    reset_code = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class AiVocabList(Base):
    __tablename__ = 'ai_vocab_lists'
    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, index=True, nullable=False)
    title = Column(String, nullable=False)
    level = Column(Integer, nullable=False)
    words_count = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    words = relationship('AiVocabWord', back_populates='vocab_list', cascade='all, delete-orphan')


class AiVocabWord(Base):
    __tablename__ = 'ai_vocab_words'
    id = Column(Integer, primary_key=True, index=True)
    list_id = Column(Integer, ForeignKey('ai_vocab_lists.id'), nullable=False)
    word = Column(String, nullable=False)
    pos = Column(String, nullable=True)
    meaning = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    vocab_list = relationship('AiVocabList', back_populates='words')
