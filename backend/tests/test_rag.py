import unittest

from rag import build_knowledge_base_from_frontend, retrieve_relevant_context


class RetrieveRelevantContextTests(unittest.TestCase):
    def test_returns_most_relevant_chunk_for_question(self):
        context = """
Word: aim
Meaning: to intend or try to achieve something
Example: They aim to improve their skills.

Word: allow
Meaning: to permit something.
"""

        question = "What does aim mean?"
        result = retrieve_relevant_context(question, context)

        self.assertIn("aim", result.lower())
        self.assertIn("intend", result.lower())
        self.assertIn("achieve", result.lower())

    def test_builds_knowledge_base_from_frontend_content(self):
        knowledge_base = build_knowledge_base_from_frontend()

        self.assertIn("aim", knowledge_base.lower())
        self.assertIn("Notice to All Library Visitors", knowledge_base)


if __name__ == "__main__":
    unittest.main()
