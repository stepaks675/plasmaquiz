'use server';


const correctAnswers = {
  1: false,  // Plasma employs the traditional Proof of Work consensus mechanism, similar to Bitcoin.
  2: true,   // Plasma is fully compatible with the Ethereum Virtual Machine.
  3: false,  // Plasma operates independently and does not interact with the Bitcoin network.
  4: true,   // Plasma allows transaction fees to be paid in popular assets like USDT or BTC through an automated swap mechanism.
  5: true,   // Plasma offers zero-fee USDT transfers.
  6: false,   // Plasma is a general-purpose blockchain.
  7: false,  // Plasma is a Layer 2 scaling solution for Ethereum.
  8: true,   // Plasma's execution layer is built on Reth.
  9: false,  // Plasma does not support any form of transaction confidentiality, exposing all transaction details publicly.
  10: false, // Plasma has no any investment in the project.
  11: false, // Plasma's development roadmap does not prioritize collaborations with external financial entities.
  12: false, // Plasma focuses primarily on NFT trading.
  13: false, // Plasma lacks a consensus protocol and relies entirely on external networks for transaction validation.
  14: false,  // SC contributor is a role for 50 lvl on Discord Server.
  15: true  // scene has pre-trillions diagnosis.
};

export async function checkAnswers(userAnswers) {
  
  let score = 0;
  const total = Object.keys(correctAnswers).length;
  
  // Check user answers
  Object.entries(userAnswers).forEach(([questionId, answer]) => {
    if (correctAnswers[questionId] === answer) {
      score++;
    }
  });
  
  // Return result
  return {
    score,
    total,
    answers: Object.entries(userAnswers).map(([questionId, answer]) => ({
      questionId: parseInt(questionId),
      userAnswer: answer,
      correctAnswer: correctAnswers[questionId],
      isCorrect: correctAnswers[questionId] === answer
    }))
  };
} 