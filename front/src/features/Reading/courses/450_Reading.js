// 450_Reading.js
const READING_STAGES = [
  {
    id: "stage_1",
    title: "Part 6: 社内通知 (基礎)",
    passageType: "Notice",
    passage: "Notice to All Library Visitors\n\nStarting next month, the Central Library will change its weekend operating hours. Currently, we close at 6:00 P.M. on Saturdays and Sundays. However, due to a large number of requests from local residents, we ------- (1) our closing time to 8:00 P.M. We hope this change allows more people to enjoy our facilities after work or school.\n\nIn addition, we are planning to expand our digital book collection. Visitors will soon be able to borrow e-books directly from our website. ------- (2). To use this new service, you will need a valid library card. If you do not have one, please visit the front desk to apply.\n\nPlease note that the library ------- (3) closed on the first Monday of every month for regular maintenance. Next month, this maintenance day falls on November 2. No books can be returned inside the building on that day, but the outside drop box will be ------- (4) for your convenience.\n\nThank you for using the Central Library.",
    questions: [
      {
        id: "q1",
        questionNumber: 1,
        questionText: "------- (1) に入る最も適切なものは？",
        choices: ["extend", "will extend", "extended", "extension"],
        correct: "will extend",
        explanation: "冒頭に「来月から（Starting next month）」とあるため、未来の予定を表す will extend が正解です。閉館時間を8時に「延長する」という文脈になります。"
      },
      {
        id: "q2",
        questionNumber: 2,
        questionText: "------- (2) に入る最も適切な文は？",
        choices: [
          "This service will be completely free for all members.",
          "The library was built ten years ago.",
          "Please return your books on time.",
          "Our staff can help you find physical books."
        ],
        correct: "This service will be completely free for all members.",
        explanation: "文挿入問題です。直前で「電子書籍をウェブサイトから借りられるようになる」と説明しているため、その詳細に触れている文が最も自然に繋がります。"
      },
      {
        id: "q3",
        questionNumber: 3,
        questionText: "------- (3) に入る最も適切なものは？",
        choices: ["is", "are", "be", "been"],
        correct: "is",
        explanation: "主語が \"the library\"（三人称単数）であり、「毎月第1月曜日は閉館する」という一般的な事実・習慣を述べているため、現在形の is が正解です。"
      },
      {
        id: "q4",
        questionNumber: 4,
        questionText: "------- (4) に入る最も適切なものは？",
        choices: ["available", "closed", "busy", "expensive"],
        correct: "available",
        explanation: "メンテナンス日は館内に入れないものの、「外の返却ボックスは便利のために〜（利用可能）」という文脈になるため、available（利用可能な）が正解になります。"
      }
    ]
  },
  {
    id: "stage_2",
    title: "Part 7: 顧客対応メール",
    passageType: "Email",
    passage: "From: j.smith@greentech.com\nTo: customer-service@officemart.com\nDate: November 5\nSubject: Order Number #4920\n\nDear Customer Service,\n\nI ordered three office chairs from your website on November 1. According to the tracking information, they were delivered yesterday. However, when I opened the box, I only found two chairs. \n\nPlease send the missing chair as soon as possible. If that is not possible, I would like a refund for one chair.\n\nSincerely,\nJohn Smith\nGreenTech Inc.",
    questions: [
      {
        id: "q5",
        questionNumber: 1,
        questionText: "Why did Mr. Smith write the email?",
        choices: [
          "To complain about a missing item",
          "To change a delivery address",
          "To order more office chairs",
          "To ask for a product catalog"
        ],
        correct: "To complain about a missing item",
        explanation: "本文に「3脚注文したのに2脚しか入っていなかった」とあり、足りない商品について連絡しているため、「届いていない商品について苦情を言うため」が正解です。"
      },
      {
        id: "q6",
        questionNumber: 2,
        questionText: "How many chairs did Mr. Smith receive yesterday?",
        choices: ["One", "Two", "Three", "Four"],
        correct: "Two",
        explanation: "「箱を開けた時、2脚しか見つからなかった（I only found two chairs）」と書かれているため、Two が正解です。"
      }
    ]
  }
];

export default READING_STAGES;