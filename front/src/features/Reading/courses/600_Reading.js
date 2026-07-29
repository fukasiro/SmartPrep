const READING_STAGES_600 = [
  {
    id: "stage_600_1",
    title: "Part 6: イベント告知・スケジュール案内",
    passageType: "Announcement",
    passage: "To: All Staff Members\nFrom: Facilities Management\nDate: March 12\nSubject: Annual Office Cleaning\n\nOur annual spring cleaning will take place this Saturday, March 15. All staff members are requested to clean their personal workspaces before leaving on Friday evening. Please make sure to collect all confidential documents and place them in the secured recycling bins.\n\nDuring Saturday's event, the main building entrance ------- (1) locked from 8:00 A.M. to 4:00 P.M. Only authorized maintenance staff will be allowed entry during this period. ------- (2). If you need access to your office on Saturday, you must obtain a special permit from the security desk by 5:00 P.M. on Friday.\n\nIn addition, professional carpet cleaning will be conducted in the conference rooms. Therefore, these rooms ------- (3) unavailable for use until Monday morning.\n\nThank you for your cooperation in keeping our workplace clean and ------- (4).\n\nFacilities Team",
    questions: [
      {
        id: "q600_1",
        questionNumber: 1,
        questionText: "------- (1) に入る最も適切なものは？",
        choices: ["will be", "was", "has been", "is being"],
        correct: "will be",
        explanation: "今週末の土曜日に予定されている未来の出来事（玄関が施錠されること）を説明しているため、未来形の will be が適切です。"
      },
      {
        id: "q600_2",
        questionNumber: 2,
        questionText: "------- (2) に入る最も適切な文は？",
        choices: [
          "Regular office hours will resume on Tuesday.",
          "Please inform us if you require additional cleaning supplies.",
          "This temporary restriction is necessary to ensure safety.",
          "We apologize for the delay in processing your request."
        ],
        correct: "This temporary restriction is necessary to ensure safety.",
        explanation: "直前で「作業中許可されたスタッフのみ立ち入り可能（施錠する）」と説明しているため、「安全を確保するためにこの一時的な規制が必要である」という理由を述べる文が最も自然に繋がります。"
      },
      {
        id: "q600_3",
        questionNumber: 3,
        questionText: "------- (3) に入る最も適切なものは？",
        choices: ["will remain", "remained", "remaining", "remains"],
        correct: "will remain",
        explanation: "カーペット掃除のため「月曜朝まで会議室が使用不能な状態のままになる」という未来の状況を表す will remain が正解です。"
      },
      {
        id: "q600_4",
        questionNumber: 4,
        questionText: "------- (4) に入る最も適切なものは？",
        choices: ["organized", "organize", "organizing", "organization"],
        correct: "organized",
        explanation: "keep + 目的語 + 形容詞 の文型です。clean（清潔な）と並列関係になる整った状態を表す形容詞 organized（整理整頓された）が適切です。"
      }
    ]
  },
  {
    id: "stage_600_2",
    title: "Part 7: 配送遅延のお詫びメール",
    passageType: "Email",
    passage: "From: support@apexappliances.com\nTo: m.fujita@email.com\nDate: April 18\nSubject: Update regarding your order #88412\n\nDear Ms. Fujita,\n\nThank you for purchasing the Apex Eco-Wash Washing Machine on April 12. We are writing to inform you that your delivery, originally scheduled for April 20, has been delayed due to an unexpected stock shortage at our regional distribution center.\n\nWe expect a new shipment to arrive at our warehouse on April 22. Your item will be dispatched immediately afterward, and we anticipate delivery to your home by April 24.\n\nWe sincerely apologize for any inconvenience this delay may cause. As a token of our appreciation for your patience, we have issued a $25 credit toward your next purchase on our website.\n\nIf you prefer to cancel your order for a full refund instead of waiting, please reply to this email or call our customer service hotline at 1-800-555-0199.\n\nSincerely,\nCustomer Care Team\nApex Appliances",
    questions: [
      {
        id: "q600_5",
        questionNumber: 1,
        questionText: "What is the main purpose of the email?",
        choices: [
          "To request confirmation of a delivery address",
          "To notify a customer of a shipping delay",
          "To offer a discount on a new washing machine",
          "To process a cancellation request"
        ],
        correct: "To notify a customer of a shipping delay",
        explanation: "本文冒頭に「delivery... has been delayed due to an unexpected stock shortage」とあり、配送の遅延を顧客に伝えることが主目的です。"
      },
      {
        id: "q600_6",
        questionNumber: 2,
        questionText: "When is the new estimated delivery date?",
        choices: ["April 12", "April 20", "April 22", "April 24"],
        correct: "April 24",
        explanation: "「we anticipate delivery to your home by April 24（4月24日までの配送を見込んでおります）」と明記されています。"
      },
      {
        id: "q600_7",
        questionNumber: 3,
        questionText: "What is offered to Ms. Fujita as compensation?",
        choices: [
          "Free installation service",
          "A replacement model",
          "A $25 store credit",
          "An extended warranty"
        ],
        correct: "A $25 store credit",
        explanation: "「we have issued a $25 credit toward your next purchase」と書かれているため、25ドル分のストアクレジットが正解です。"
      }
    ]
  }
];

export default READING_STAGES_600;