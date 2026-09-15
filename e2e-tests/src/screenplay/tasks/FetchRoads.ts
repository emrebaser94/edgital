import { Task } from '@serenity-js/core';
import { GetRequest, Send } from '@serenity-js/rest';

/** Fetch all roads from the API. Populates `LastResponse` for the questions
 *  that read it (`PropertiesOfRoad`, `AverageGwGrade` and the `…FromApi` ones). */
export const FetchRoads = () =>
  Task.where('#actor fetches all roads from the API',
    Send.a(GetRequest.to('/roads')),
  );
