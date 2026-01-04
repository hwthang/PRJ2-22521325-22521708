export const normalizeSurvey = (survey) => {
  const questions = Object.keys(survey)
    .filter((k) => !isNaN(k))
    .map((k) => survey[k]);

  return {
    metadata: {
      _id: survey._id,
      name: survey.name || "",
      startedAt: survey.startedAt,

      endedAt: survey.endedAt,
    },
    questions,
  };
};
