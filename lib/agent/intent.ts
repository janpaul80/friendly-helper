/**
 * LangDock Agent - Intent Classification
 *
 * Classifies user messages into intents to control agent behavior
 */

export enum UserIntent {
  GREETING = 'GREETING',
  QUESTION = 'QUESTION',
  PLAN_REQUEST = 'PLAN_REQUEST',
  CODE_REQUEST = 'CODE_REQUEST',
  APPROVAL = 'APPROVAL',
  EDIT_PLAN = 'EDIT_PLAN'
}

export class IntentClassifier {
  /**
   * Classify user message intent
   */
  static classify(message: string): UserIntent {
    const lowerMsg = message.toLowerCase().trim();

    // GREETING patterns
    const greetingPatterns = [
      'hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening',
      'howdy', 'greetings', 'sup', 'yo', 'what\'s up', 'how are you'
    ];
    if (greetingPatterns.some(pattern => lowerMsg.includes(pattern)) &&
      lowerMsg.length < 50) {
      return UserIntent.GREETING;
    }

    // APPROVAL patterns
    const approvalPatterns = [
      'yes', 'go ahead', 'proceed', 'approved', 'looks good', 'let\'s do it',
      'execute', 'run it', 'start', 'begin', 'okay', 'ok', 'sure'
    ];
    if (approvalPatterns.some(pattern => lowerMsg.includes(pattern))) {
      return UserIntent.APPROVAL;
    }

    // QUESTION patterns (Explicit)
    const questionPatterns = [
      'how to', 'how do i', 'explain', 'what is', 'why is', 'can you tell me',
      'where is', 'does the', 'is there'
    ];
    if (questionPatterns.some(pattern => lowerMsg.includes(pattern))) {
      return UserIntent.QUESTION;
    }

    // PLAN_REQUEST patterns - CHECK BEFORE CODE_REQUEST!
    // All "build X" requests should create a plan first
    const planPatterns = [
      'i want to build', 'i need to create', 'let\'s build', 'plan for',
      'i want a', 'i need a', 'build a', 'create a', 'make a', 'scaffold',
      'build me', 'create me', 'make me' // These should plan first!
    ];
    if (planPatterns.some(pattern => lowerMsg.includes(pattern))) {
      return UserIntent.PLAN_REQUEST;
    }

    // CODE_REQUEST patterns - Only for explicit code commands
    const codePatterns = [
      'build this', 'create this', 'make this', 'code this', 'implement',
      'generate code', 'write the code', 'code it',
      'fix', 'update', 'change', 'refactor', 'optimize', 'add'
    ];
    if (codePatterns.some(pattern => lowerMsg.includes(pattern))) {
      return UserIntent.CODE_REQUEST;
    }

    // EDIT_PLAN patterns
    const editPatterns = [
      'change the plan', 'modify the plan', 'update the plan', 'revise',
      'add to the plan', 'remove from', 'instead of'
    ];
    if (editPatterns.some(pattern => lowerMsg.includes(pattern))) {
      return UserIntent.EDIT_PLAN;
    }

    // Default to QUESTION for anything else
    return UserIntent.QUESTION;
  }

  /**
   * Check if intent should trigger code generation
   */
  static shouldGenerateCode(intent: UserIntent): boolean {
    return intent === UserIntent.CODE_REQUEST || intent === UserIntent.APPROVAL;
  }

  /**
   * Check if intent should trigger file modifications
   */
  static shouldModifyFiles(intent: UserIntent): boolean {
    return intent === UserIntent.CODE_REQUEST || intent === UserIntent.APPROVAL;
  }
}
