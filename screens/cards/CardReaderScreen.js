// screens/cards/CardReaderScreen.js: a card from Apprec8 opens as study cards (owner, 16 Nov 2026: "it is not just a
// card, it is supposed to have questions too"): the same LearnCards screen as quests (idea cards + one-tap questions).
// Last screen: Done (back to Home) or "More like this ›" (the whole quest from its start). Marks the card opened/done.
import React, { useEffect, useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";
import LearnCards from "../../components/learn/LearnCards";
import { learnCards } from "../../utils/learnCards";
import { setCardStatus } from "../../services/cardsApi";

export default function CardReaderScreen({ navigation, route }) {
  const card = route.params?.card || {};
  const { isDark } = useTheme();
  // A card without pages shows its own title + text as one idea card.
  const cards = useMemo(() => learnCards({ cards: card.cards }) || [{ kind: "idea", title: card.title, text: card.text || card.title }], [card]);

  useEffect(() => {
    if (card.id && card.status === "new") setCardStatus(card.id, "opened");
  }, [card.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const done = () => card.id && card.kind !== "task" && setCardStatus(card.id, "done");
  return (
    <LearnCards
      cards={cards}
      title={card.title}
      cardKey={`card-${card.id || "x"}`}
      isDark={isDark}
      finishLabel="DONE ✓"
      onFinish={() => {
        done();
        navigation.goBack();
      }}
      extraAction={
        card.moreQuestId
          ? {
              label: "More like this ›",
              onPress: () => {
                done();
                navigation.replace("EnglishQuestIntro", { questId: card.moreQuestId });
              },
            }
          : null
      }
    />
  );
}
