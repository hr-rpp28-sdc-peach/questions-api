ALTER SEQUENCE "Questions_id_seq" RESTART WITH 3518968;
ALTER SEQUENCE "Answers_id_seq" RESTART WITH 6879355;
ALTER SEQUENCE "Photos_id_seq" RESTART WITH 2063760;

CREATE INDEX product_id_index ON "Questions" (product_id);
CREATE INDEX question_id_index ON "Answers" (question_id);
CREATE INDEX answer_id_index ON "Photos" (answer_id);

/*
in psql
\i ./database/psqlCommands.sql;
*/