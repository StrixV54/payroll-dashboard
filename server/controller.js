import admin from "./firebase.js";
import { objectHasGivenKeysWithTruthyValues } from "./util.js";

export const createUserAPI = async (req, res) => {
  try {
    const data = req.body;
    const resultObject = objectHasGivenKeysWithTruthyValues(data, [
      "email",
      "password",
      "displayName",
    ]);
    if (resultObject.booleanValue) {
      const { email, password, displayName } = data;
      const resp = await admin.auth().createUser({
        email,
        password,
        displayName,
        providerToLink: "email",
      });
      res
        .status(200)
        .json({ message: "Successfully Added User", uid: resp.uid });
    } else {
      res
        .status(400)
        .json({ message: "Field is missing/null : " + resultObject.field });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
