import json
from database import SessionLocal, engine, Base
from models import ReadingPassage, ReadingQuestion

# DBのテーブル作成確認
Base.metadata.create_all(bind=engine)

# 投入用データ定義
READING_DATA = [
    {
        "course_level": 450,
        "id": "stage_450_1",
        "title": "Part 6: イベント告知・スケジュール案内",
        "passageType": "Announcement",
        "passage": "To: All Staff Members\nFrom: Facilities Management\nDate: March 12\nSubject: Annual Office Cleaning\n\nOur annual spring cleaning will take place this Saturday, March 15. All staff members are requested to clean their personal workspaces before leaving on Friday evening. Please make sure to collect all confidential documents and place them in the secured recycling bins.\n\nDuring Saturday's event, the main building entrance ------- (1) locked from 8:00 A.M. to 4:00 P.M. Only authorized maintenance staff will be allowed entry during this period. ------- (2). If you need access to your office on Saturday, you must obtain a special permit from the security desk by 5:00 P.M. on Friday.\n\nIn addition, professional carpet cleaning will be conducted in the conference rooms. Therefore, these rooms ------- (3) unavailable for use until Monday morning.\n\nThank you for your cooperation in keeping our workplace clean and ------- (4).\n\nFacilities Team",
        "questions": [
            {
                "id": "q450_1",  # ID重複を回避するため修正
                "questionNumber": 1,
                "questionText": "------- (1) に入る最も適切なものは？",
                "choices": ["will be", "was", "has been", "is being"],
                "correct": "will be",
                "explanation": "今週末の土曜日に予定されている未来の出来事（玄関が施錠されること）を説明しているため、未来形の will be が適切です。"
            },
            {
                "id": "q450_2",  # ID重複を回避するため修正
                "questionNumber": 2,
                "questionText": "------- (2) に入る最も適切な文は？",
                "choices": [
                    "Regular office hours will resume on Tuesday.",
                    "Please inform us if you require additional cleaning supplies.",
                    "This temporary restriction is necessary to ensure safety.",
                    "We apologize for the delay in processing your request."
                ],
                "correct": "This temporary restriction is necessary to ensure safety.",
                "explanation": "直前で「作業中許可されたスタッフのみ立ち入り可能（施錠する）」と説明しているため、「安全を確保するためにこの一時的な規制が必要である」という理由を述べる文が最も自然に繋がります。"
            },
            {
                "id": "q450_3",  # ID重複を回避するため修正
                "questionNumber": 3,
                "questionText": "------- (3) に入る最も適切なものは？",
                "choices": ["will remain", "remained", "remaining", "remains"],
                "correct": "will remain",
                "explanation": "カーペット掃除のため「月曜朝まで会議室が使用不能な状態のままになる」という未来の状況を表す will remain が正解です。"
            },
            {
                "id": "q450_4",  # ID重複を回避するため修正
                "questionNumber": 4,
                "questionText": "------- (4) に入る最も適切なものは？",
                "choices": ["organized", "organize", "organizing", "organization"],
                "correct": "organized",
                "explanation": "keep + 目的語 + 形容詞 の文型です。clean（清潔な）と並列関係になる整った状態を表す形容詞 organized（整理整頓された）が適切です。"
            }
        ]
    },
    
    {
        "course_level": 600,
        "id": "stage_600_2",
        "title": "Part 6: イベント告知・スケジュール案内",
        "passageType": "Announcement",
        "passage": "To: All Staff Members\nFrom: Facilities Management\nDate: March 12\nSubject: Annual Office Cleaning\n\nOur annual spring cleaning will take place this Saturday, March 15. All staff members are requested to clean their personal workspaces before leaving on Friday evening. Please make sure to collect all confidential documents and place them in the secured recycling bins.\n\nDuring Saturday's event, the main building entrance ------- (1) locked from 8:00 A.M. to 4:00 P.M. Only authorized maintenance staff will be allowed entry during this period. ------- (2). If you need access to your office on Saturday, you must obtain a special permit from the security desk by 5:00 P.M. on Friday.\n\nIn addition, professional carpet cleaning will be conducted in the conference rooms. Therefore, these rooms ------- (3) unavailable for use until Monday morning.\n\nThank you for your cooperation in keeping our workplace clean and ------- (4).\n\nFacilities Team",
        "questions": [
            {
                "id": "q600_1",
                "questionNumber": 1,
                "questionText": "------- (1) に入る最も適切なものは？",
                "choices": ["will be", "was", "has been", "is being"],
                "correct": "will be",
                "explanation": "今週末の土曜日に予定されている未来の出来事（玄関が施錠されること）を説明しているため、未来形の will be が適切です。"
            },
            {
                "id": "q600_2",
                "questionNumber": 2,
                "questionText": "------- (2) に入る最も適切な文は？",
                "choices": [
                    "Regular office hours will resume on Tuesday.",
                    "Please inform us if you require additional cleaning supplies.",
                    "This temporary restriction is necessary to ensure safety.",
                    "We apologize for the delay in processing your request."
                ],
                "correct": "This temporary restriction is necessary to ensure safety.",
                "explanation": "直前で「作業中許可されたスタッフのみ立ち入り可能（施錠する）」と説明しているため、「安全を確保するためにこの一時的な規制が必要である」という理由を述べる文が最も自然に繋がります。"
            },
            {
                "id": "q600_3",
                "questionNumber": 3,
                "questionText": "------- (3) に入る最も適切なものは？",
                "choices": ["will remain", "remained", "remaining", "remains"],
                "correct": "will remain",
                "explanation": "カーペット掃除のため「月曜朝まで会議室が使用不能な状態のままになる」という未来の状況を表す will remain が正解です。"
            },
            {
                "id": "q600_4",
                "questionNumber": 4,
                "questionText": "------- (4) に入る最も適切なものは？",
                "choices": ["organized", "organize", "organizing", "organization"],
                "correct": "organized",
                "explanation": "keep + 目的語 + 形容詞 の文型です。clean（清潔な）と並列関係になる整った状態を表す形容詞 organized（整理整頓された）が適切です。"
            }
        ]
    },
    {
        "course_level": 600,
        "id": "stage_600_3",
        "title": "Part 7: 配送遅延のお詫びメール",
        "passageType": "Email",
        "passage": "From: support@apexappliances.com\nTo: m.fujita@email.com\nDate: April 18\nSubject: Update regarding your order #88412\n\nDear Ms. Fujita,\n\nThank you for purchasing the Apex Eco-Wash Washing Machine on April 12. We are writing to inform you that your delivery, originally scheduled for April 20, has been delayed due to an unexpected stock shortage at our regional distribution center.\n\nWe expect a new shipment to arrive at our warehouse on April 22. Your item will be dispatched immediately afterward, and we anticipate delivery to your home by April 24.\n\nWe sincerely apologize for any inconvenience this delay may cause. As a token of our appreciation for your patience, we have issued a $25 credit toward your next purchase on our website.\n\nIf you prefer to cancel your order for a full refund instead of waiting, please reply to this email or call our customer service hotline at 1-800-555-0199.\n\nSincerely,\nCustomer Care Team\nApex Appliances",
        "questions": [
            {
                "id": "q600_5",
                "questionNumber": 1,
                "questionText": "What is the main purpose of the email?",
                "choices": [
                    "To request confirmation of a delivery address",
                    "To notify a customer of a shipping delay",
                    "To offer a discount on a new washing machine",
                    "To process a cancellation request"
                ],
                "correct": "To notify a customer of a shipping delay",
                "explanation": "本文冒頭に「delivery... has been delayed due to an unexpected stock shortage」とあり、配送の遅延を顧客に伝えることが主目的です。"
            },
            {
                "id": "q600_6",
                "questionNumber": 2,
                "questionText": "When is the new estimated delivery date?",
                "choices": ["April 12", "April 20", "April 22", "April 24"],
                "correct": "April 24",
                "explanation": "「we anticipate delivery to your home by April 24（4月24日までの配送を見込んでおります）」と明記されています。"
            },
            {
                "id": "q600_7",
                "questionNumber": 3,
                "questionText": "What is offered to Ms. Fujita as compensation?",
                "choices": [
                    "Free installation service",
                    "A replacement model",
                    "A $25 store credit",
                    "An extended warranty"
                ],
                "correct": "A $25 store credit",
                "explanation": "「we have issued a $25 credit toward your next purchase」と書かれているため、25ドル分のストアクレジットが正解です。"
            }
        ]
    },

    # ---------------- 730点レベル ----------------
    {
        "course_level": 730,
        "id": "stage_730_4",
        "title": "Part 6: プレスリリース (組織再編)",
        "passageType": "Press Release",
        "passage": "SEATTLE — Nov 10 — Horizon Media Holdings today announced plans to merge its publishing and digital marketing divisions into a single unified business unit. The restructuring, which will take effect on January 1, aims to ------- (1) internal workflows and accelerate the company's digital expansion.\n\nUnder the new structure, Ms. Elena Rostova, currently Head of Digital Operations, will assume the position of Chief Operating Officer. ------- (2). Her extensive experience in cross-platform marketing is expected to drive substantial growth in global markets.\n\n\"Consolidating our teams allows us to respond much faster to changing consumer preferences,\" said David Vance, CEO of Horizon Media. \"By eliminating duplicate administrative tasks, we can ------- (3) more resources toward creative content development.\"\n\nExisting clients should note that their primary points of contact will remain ------- (4). Account managers will reach out individually over the coming weeks to discuss how these enhancements will benefit client campaigns.",
        "questions": [
            {
                "id": "q730_1",
                "questionNumber": 1,
                "questionText": "------- (1) に入る最も適切なものは？",
                "choices": ["streamline", "streamlined", "streamlining", "streamlines"],
                "correct": "streamline",
                "explanation": "aims to + 動詞の原形（不定詞）の形をとります。「業務フローを簡素化・効率化する」という意味の streamline が適切です。"
            },
            {
                "id": "q730_2",
                "questionNumber": 2,
                "questionText": "------- (2) に入る最も適切な文は？",
                "choices": [
                    "She will oversee both content production and advertising strategies.",
                    "Digital marketing budgets have been reduced by ten percent.",
                    "The company was founded in Seattle over twenty years ago.",
                    "Employees are requested to submit their application forms early."
                ],
                "correct": "She will oversee both content production and advertising strategies.",
                "explanation": "直前でエレナ・ロストヴァ氏が最高執行責任者（COO）に就任することが言及されているため、「彼女がコンテンツ制作と広告戦略の両方を統括する」という職務内容の説明がベストです。"
            },
            {
                "id": "q730_3",
                "questionNumber": 3,
                "questionText": "------- (3) に入る最も適切なものは？",
                "choices": ["allocate", "withdraw", "reject", "substitute"],
                "correct": "allocate",
                "explanation": "「より多くのリソースを創作コンテンツの開発に～（配分する・割り振る）」という意味になるため、allocate が正解です。"
            },
            {
                "id": "q730_4",
                "questionNumber": 4,
                "questionText": "------- (4) に入る最も適切なものは？",
                "choices": ["unchanged", "uncertain", "unfortunate", "unconscious"],
                "correct": "unchanged",
                "explanation": "文脈上、既存顧客に対して「担当窓口は変わらない（unchanged）」と伝えて安心させる内容が適合します。"
            }
        ]
    },
    {
        "course_level": 730,
        "id": "stage_730_2",
        "title": "Part 7: ビジネス報告記事 (市場動向)",
        "passageType": "Article",
        "passage": "Urban Transit Monthly — June Edition\n\nThe City Council of Oakridge approved a $45 million budget allocation yesterday to modernize the city's public transportation network. The ambitious project, set to begin in August, focuses primarily on expanding the electric bus fleet and upgrading passenger facilities at major transit hubs.\n\nAccording to Transportation Director Sandra Miller, the decision comes in response to a 15% increase in commuter ridership over the past two years. \"Our existing infrastructure is operating near maximum capacity during peak travel hours,\" Miller stated during yesterday's press conference. \"Investing in clean energy vehicles will not only alleviate traffic congestion but also support our environmental sustainability goals.\"\n\nPhase One of the initiative involves purchasing 30 zero-emission electric buses from GreenMotion Motors. In addition, digital arrival display boards will be installed at 50 bus shelters across the downtown district by December. Construction of a dedicated charging depot is slated for completion early next year.",
        "questions": [
            {
                "id": "q730_5",
                "questionNumber": 1,
                "questionText": "What prompted the City Council to approve the budget?",
                "choices": [
                    "A decrease in state tax revenues",
                    "A rise in public transit passengers",
                    "A complaint from bus manufacturers",
                    "An urge to reduce parking fees"
                ],
                "correct": "A rise in public transit passengers",
                "explanation": "「comes in response to a 15% increase in commuter ridership（過去2年間の利用者の15%増加を受けて）」とあり、乗客数の増加が要因です。"
            },
            {
                "id": "q730_6",
                "questionNumber": 2,
                "questionText": "What is mentioned about Phase One of the project?",
                "choices": [
                    "It will focus exclusively on suburban train lines.",
                    "Electric buses will be acquired from GreenMotion Motors.",
                    "All bus shelters will be completely rebuilt.",
                    "A charging depot was completed last month."
                ],
                "correct": "Electric buses will be acquired from GreenMotion Motors.",
                "explanation": "第3段落冒頭「Phase One... involves purchasing 30 zero-emission electric buses from GreenMotion Motors」と記載されています。"
            },
            {
                "id": "q730_7",
                "questionNumber": 3,
                "questionText": "According to the article, what will be completed by December?",
                "choices": [
                    "The installation of digital displays at 50 locations",
                    "The construction of a new charging facility",
                    "The recruitment of additional bus drivers",
                    "The full retirement of diesel vehicles"
                ],
                "correct": "The installation of digital displays at 50 locations",
                "explanation": "「digital arrival display boards will be installed at 50 bus shelters... by December」と書かれているため、デジタル案内板の設置が正解です。"
            }
        ]
    },

    # ---------------- 860点レベル ----------------
    {
        "course_level": 860,
        "id": "stage_860_1",
        "title": "Part 6: 企業買収・ガバナンス通達",
        "passageType": "Corporate Notice",
        "passage": "To: Department Managers and Regional Directors\nFrom: Executive Committee, Vantage Global Corp.\nDate: October 4\nSubject: Finalization of Strategic Acquisition\n\nWe are pleased to inform you that Vantage Global Corp. has formally completed the acquisition of Lumina Software Solutions. This transaction marks a significant milestone in our strategy to ------- (1) our software architecture and expand our footprint in cloud-based enterprise services.\n\nWhile operating teams from both organizations will eventually be integrated, Lumina will function as an autonomous subsidiary ------- (2) the second quarter of next fiscal year. This deliberate transition period is designed to prevent operational disruption and allow our technical specialists to thoroughly audit Lumina's proprietary platforms.\n\n------- (3). Consequently, department heads are instructed to pause any pending recruitment for software engineers until the joint workforce planning committee issues its staffing framework on November 15.\n\nWe appreciate your discretion and leadership during this transformative phase. Please direct any media inquiries to the Corporate Communications Office, as individual employees are strictly ------- (4) from making public statements.",
        "questions": [
            {
                "id": "q860_1",
                "questionNumber": 1,
                "questionText": "------- (1) に入る最も適切なものは？",
                "choices": ["fortify", "fortified", "fortification", "fortifying"],
                "correct": "fortify",
                "explanation": "to + 動詞の原形。「ソフトウェア体系を強化・堅固にする」という意味の動詞 fortify が正解です。"
            },
            {
                "id": "q860_2",
                "questionNumber": 2,
                "questionText": "------- (2) に入る最も適切なものは？",
                "choices": ["through", "prior", "despite", "whereas"],
                "correct": "through",
                "explanation": "「来年度の第2四半期を通じて（終わるまで）自立した子会社として機能する」という継続期間を表す前置詞 through が適切です。"
            },
            {
                "id": "q860_3",
                "questionNumber": 3,
                "questionText": "------- (3) に入る最も適切な文は？",
                "choices": [
                    "Lumina's CEO will immediately resign from all corporate boards.",
                    "Duplicate positions will be evaluated during the upcoming workforce assessment.",
                    "Our quarterly financial results exceeded initial market projections.",
                    "All software licenses must be renewed before the end of the month."
                ],
                "correct": "Duplicate positions will be evaluated during the upcoming workforce assessment.",
                "explanation": "直後で「エンジニアの新規採用を中断し、人員配置の枠組み策定を待つように」と指示しているため、重複するポストの査定に言及している文が文脈上最も論理的です。"
            },
            {
                "id": "q860_4",
                "questionNumber": 4,
                "questionText": "------- (4) に入る最も適切なものは？",
                "choices": ["prohibited", "persuaded", "promoted", "provided"],
                "correct": "prohibited",
                "explanation": "メディアからの問合せは広報へ回し「個々の従業員が公の声明を出すことは固く禁じられている」という意味になる prohibited（禁止されている）が文脈に合致するため正解です。"
            }
        ]
    }
]

def seed_database():
    db = SessionLocal()
    try:
        for stage in READING_DATA:
            # パッセージ（親データ）の重複チェック
            existing = db.query(ReadingPassage).filter(ReadingPassage.id == stage["id"]).first()
            if existing:
                print(f"Skipping {stage['id']} (Already exists) - seed_reading.py:299")
                continue

            passage_obj = ReadingPassage(
                id=stage["id"],
                course_level=stage["course_level"],
                title=stage["title"],
                passage_type=stage["passageType"],
                passage=stage["passage"]
            )
            db.add(passage_obj)

            for q in stage["questions"]:
                # 子テーブル側も既存チェックを入れるとより安全です
                existing_q = db.query(ReadingQuestion).filter(ReadingQuestion.id == q["id"]).first()
                if existing_q:
                    print(f"Skipping question {q['id']} (Already exists) - seed_reading.py:315")
                    continue

                q_obj = ReadingQuestion(
                    id=q["id"],
                    passage_id=stage["id"],
                    question_number=q["questionNumber"],
                    question_text=q["questionText"],
                    choices=json.dumps(q["choices"], ensure_ascii=False),
                    correct=q["correct"],
                    explanation=q["explanation"]
                )
                db.add(q_obj)

        db.commit()
        print("Successfully seeded reading data! - seed_reading.py:330")
    except Exception as e:
        db.rollback()
        print(f"Error seeding data: {e} - seed_reading.py:333")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()