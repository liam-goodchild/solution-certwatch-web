import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { validateToken } from "../../shared/auth/validateToken";
import { containers } from "../../shared/db/cosmosClient";
import { User } from "../../shared/models/user";
import { syncCredlyForUser } from "../../shared/sync/syncUser";

interface SyncRequest {
  username?: string;
}

async function handler(
  req: HttpRequest,
  _ctx: InvocationContext,
): Promise<HttpResponseInit> {
  let auth;
  try {
    auth = await validateToken(req);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    return { status: 401, jsonBody: { error: message } };
  }

  const body = (await req.json().catch(() => ({}))) as SyncRequest;
  const providedUsername = (body.username ?? "").trim();

  const usersContainer = containers.users();
  const { resource: user } = await usersContainer
    .item(auth.userId, auth.userId)
    .read<User>();

  if (!user) {
    return {
      status: 404,
      jsonBody: { error: "User profile not found. Call PUT /v1/users/me first." },
    };
  }

  // A username in the body links/relinks the profile ("Link & import"); without
  // it we sync the already-linked profile ("Sync now").
  const effective = providedUsername || user.credlyUsername?.trim();
  if (!effective) {
    return {
      status: 400,
      jsonBody: {
        error: "No Credly profile linked. Provide a Credly username to link.",
      },
    };
  }

  const targetUser: User = providedUsername
    ? { ...user, credlyUsername: providedUsername }
    : user;

  try {
    const result = await syncCredlyForUser(targetUser);
    return {
      status: 200,
      jsonBody: {
        status: "synced",
        credlyUsername: effective,
        ...result,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Credly sync failed.";
    return { status: 502, jsonBody: { error: message } };
  }
}

app.http("syncCertifications", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "v1/certifications/sync",
  handler,
});
