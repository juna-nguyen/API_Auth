import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

let firebaseAuth = null;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    let serviceAccount;

    if (typeof process.env.FIREBASE_SERVICE_ACCOUNT === "string") {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
      serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
    }

    if (serviceAccount && serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(
        /\\n/g,
        "\n",
      );
    }

    const app = getApps().length
      ? getApps()[0]
      : initializeApp({
          credential: cert(serviceAccount),
        });

    firebaseAuth = getAuth(app);
    console.log(
      "[Firebase Admin] Kh?i t?o th�nh c�ng cho project:",
      serviceAccount.project_id,
    );
  } else {
    console.warn(
      "[Firebase Warning] Thi?u bi?n m�i tru?ng FIREBASE_SERVICE_ACCOUNT.",
    );
  }
} catch (error) {
  console.error(
    "[Firebase Warning] Kh�ng th? kh?i t?o Firebase Admin:",
    error.message,
  );
}

export default firebaseAuth;
