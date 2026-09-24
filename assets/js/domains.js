/**
 * AIF-C01 Exam Sim — the five official content domains.
 *
 * `weight` is the domain's share of the scored exam, from the official
 * AWS Certified AI Practitioner (AIF-C01) Exam Guide. The simulator uses it
 * to report your per-domain performance next to the weight it actually
 * carries, so you can see where a weak domain costs you the most points.
 *
 * `docs` are the official AWS pages the results screen links to whenever a
 * domain comes in under the 70% readiness line.
 */
window.EXAM_DOMAINS = {
  d1: {
    code: "Domain 1",
    name: "Fundamentals of AI and ML",
    icon: "🧠",
    weight: 20,
    blurb: "AI/ML/DL terminology, learning types, the ML lifecycle, evaluation metrics, and which managed AWS AI service fits a use case.",
    docs: [
      { label: "What is artificial intelligence?", url: "https://aws.amazon.com/what-is/artificial-intelligence/", src: "AWS" },
      { label: "What is machine learning?", url: "https://aws.amazon.com/what-is/machine-learning/", src: "AWS" },
      { label: "Amazon SageMaker AI — Developer Guide", url: "https://docs.aws.amazon.com/sagemaker/latest/dg/whatis.html", src: "Docs" },
      { label: "AWS AI services overview", url: "https://aws.amazon.com/machine-learning/ai-services/", src: "AWS" },
    ],
  },
  d2: {
    code: "Domain 2",
    name: "Fundamentals of Generative AI",
    icon: "✨",
    weight: 24,
    blurb: "Tokens, embeddings, foundation models and LLMs, their capabilities and limits, and the AWS infrastructure behind generative AI.",
    docs: [
      { label: "What is generative AI?", url: "https://aws.amazon.com/what-is/generative-ai/", src: "AWS" },
      { label: "What is a foundation model?", url: "https://aws.amazon.com/what-is/foundation-models/", src: "AWS" },
      { label: "Amazon Bedrock — User Guide", url: "https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html", src: "Docs" },
      { label: "AWS Trainium & Inferentia", url: "https://aws.amazon.com/ai/machine-learning/trainium/", src: "AWS" },
    ],
  },
  d3: {
    code: "Domain 3",
    name: "Applications of Foundation Models",
    icon: "🏗️",
    weight: 28,
    blurb: "Model selection, inference parameters, RAG and vector stores, prompt engineering, fine-tuning, agents, and evaluating results.",
    docs: [
      { label: "What is RAG?", url: "https://aws.amazon.com/what-is/retrieval-augmented-generation/", src: "AWS" },
      { label: "Amazon Bedrock Knowledge Bases", url: "https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html", src: "Docs" },
      { label: "Amazon Bedrock Agents", url: "https://docs.aws.amazon.com/bedrock/latest/userguide/agents.html", src: "Docs" },
      { label: "Prompt engineering guidelines", url: "https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-engineering-guidelines.html", src: "Docs" },
    ],
  },
  d4: {
    code: "Domain 4",
    name: "Guidelines for Responsible AI",
    icon: "⚖️",
    weight: 14,
    blurb: "Bias and fairness, guardrails, transparency, explainability, human-in-the-loop review, and the AWS responsible-AI dimensions.",
    docs: [
      { label: "AWS Responsible AI", url: "https://aws.amazon.com/ai/responsible-ai/", src: "AWS" },
      { label: "Amazon Bedrock Guardrails", url: "https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html", src: "Docs" },
      { label: "SageMaker Clarify — bias & explainability", url: "https://docs.aws.amazon.com/sagemaker/latest/dg/clarify-configure-processing-jobs.html", src: "Docs" },
      { label: "SageMaker Ground Truth (human review)", url: "https://docs.aws.amazon.com/sagemaker/latest/dg/sms.html", src: "Docs" },
    ],
  },
  d5: {
    code: "Domain 5",
    name: "Security, Compliance & Governance",
    icon: "🔐",
    weight: 14,
    blurb: "IAM, encryption and data residency, PII discovery, the shared responsibility model, logging, auditing and ML governance.",
    docs: [
      { label: "AWS Shared Responsibility Model", url: "https://aws.amazon.com/compliance/shared-responsibility-model/", src: "AWS" },
      { label: "Bedrock security & data protection", url: "https://docs.aws.amazon.com/bedrock/latest/userguide/data-protection.html", src: "Docs" },
      { label: "Bedrock model invocation logging", url: "https://docs.aws.amazon.com/bedrock/latest/userguide/model-invocation-logging.html", src: "Docs" },
      { label: "Amazon Macie — sensitive data discovery", url: "https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html", src: "Docs" },
    ],
  },
};
