import React, { useEffect } from "react";
import AppFlatList from "../components/common/list/AppFlatList";
import {
  getTopicDetailData,
  getTopicQuiz,
  getTopicStudy,
} from "../data/latest/app-topic-detail-data";

const LinksScreen = ({ route, navigation }) => {
  const data = route?.params?.data || [];

  const handleLinkPress = (link) => {
    console.log("Navigating to Screen Id: " + link.id); // just figure out the type and use id to fetch content
    const availableScreens = navigation.getState()?.routeNames || [];
    const activityKeys = Object.keys(link.activities || {});
    console.log(activityKeys); // ["study", "quiz"]

    // if Type COMPLEX then show ActivityScreen with links based on meatdata
    // If Type is STUDY then show Apprec8Reader
    // If Type is COURSE then show LinkScreen
    // If Type is QUIZ then show QuizScreen
    switch (link.type) {
      case "STUDY":
        const studyData =
          typeof link.parentId === "undefined"
            ? getTileStudy(link.id)
            : getTopicStudy(link.parentId);
        navigation.navigate("Apprec8Reader", { data: studyData });
        break;
      case "ACTIVITY":
        console.log("You link typpe is ACTIVITY");
        const activities = Object.entries(link.activities)
          .filter(([key, value]) => value) // Only include if value is `true`
          .map(([activityType]) => ({
            id: `${link.id}-${activityType}`, // Unique composite key
            title: activityType.charAt(0).toUpperCase() + activityType.slice(1), // "study" → "Study"
            parentId: link.id, // "4-imo-divison"
            type: activityType.toUpperCase(), // "STUDY" or "QUIZ"
          }));
        console.log(activities);
        navigation.navigate("LinkScreen", { data: activities });
        break;
      case "COURSE":
        console.log("You link typpe is COURSE");
        break;
      case "QUIZ":
        console.log("You link type is QUIZ for id: " + link.parentId);
        const quizzes = getTopicQuiz(link.parentId);
        navigation.navigate("Quiz", { data: quizzes });
        break;
      default:
        const availableScreens = navigation.getState()?.routeNames || [];
        if (availableScreens.includes(link.id)) {
          navigation.navigate(link.id, { title: link.title });
        } else {
          // Navigate to a fallback or dummy screen
          navigation.navigate("DummyScreen", {
            errorMessage: `Screen "${link.title}" not found.`,
          });
        }
    }
  };

  return (
    <AppFlatList data={data} isPressable={true} onItemPress={handleLinkPress} />
  );
};

export default LinksScreen;
