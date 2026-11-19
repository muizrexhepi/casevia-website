export function followupText(
  language: "en" | "sq" | "mk" | "de",
  name: string,
) {
  const messages = {
    en: {
      subject: "Following up on your project",
      body: `Hello ${name},\n\nI wanted to follow up on our conversation. Is there anything I can clarify about your project?\n\nBest,\nMuiz`,
    },
    sq: {
      subject: "Rreth projektit tuaj",
      body: `Përshëndetje ${name},\n\nDesha të vazhdoj bisedën tonë. A ka diçka që mund të sqaroj rreth projektit tuaj?\n\nMe respekt,\nMuiz`,
    },
    mk: {
      subject: "Во врска со вашиот проект",
      body: `Здраво ${name},\n\nСакав да се надоврзам на нашиот разговор. Дали има нешто што можам да појаснам за вашиот проект?\n\nПоздрав,\nМуиз`,
    },
    de: {
      subject: "Zu Ihrem Projekt",
      body: `Guten Tag ${name},\n\nich möchte an unser Gespräch anknüpfen. Kann ich noch etwas zu Ihrem Projekt klären?\n\nFreundliche Grüße\nMuiz`,
    },
  };
  return messages[language];
}
