import { useCallback, useState } from "react";
import { GoogleAuthScope } from "./GoogleAuthScope";

if (process.env.REACT_APP_OAUTH_CLIENT_ID === undefined) {
    throw new Error("Required environment variable `REACT_APP_OAUTH_CLIENT_ID` not set during build time.");
}
const CLIENT_ID = process.env.REACT_APP_OAUTH_CLIENT_ID;

export enum AuthError {
    None,
    LibrariesNotLoaded,
    PopupBlocked,
    Unknown
}

export interface AuthManagement {
    authedScopes: Set<GoogleAuthScope>;
    isPending: boolean;
    startAuthFlow: (scopes: GoogleAuthScope[]) => Promise<google.accounts.oauth2.TokenResponse>;
    revokeAuth: () => void;
}

/**
 * Provides the current state of authentication with Google APIs and utility functions for managing that state.
 *
 * **IMPORTANT**: Only use this hook once per app.  This is because Google APIs load in global scope and manage their
 * state in a global manner as well.
 *
 * @param areApisLoaded whether both the Google client libraries and identity services are loaded and ready to use
 */
export function useAuth(areApisLoaded: boolean): AuthManagement {
    // API for implementing stuff: https://developers.google.com/identity/oauth2/web/reference/js-reference
    const [authedScopes, setAuthedScopes] = useState<Set<GoogleAuthScope>>(new Set());
    const [isPending, setIsPending] = useState(false);

    const startAuthFlow = useCallback((scopes: GoogleAuthScope[]) => {
        if (!areApisLoaded) {
            return Promise.reject(AuthError.LibrariesNotLoaded);
        }

        setIsPending(true);
        return new Promise<google.accounts.oauth2.TokenResponse>((resolve, reject) => {
            const tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: scopes.join(" "),
                prompt: "",
                callback: async (response) => {
                    setIsPending(false);
                    if (response.error !== undefined) {
                        console.error("Auth process failed:");
                        console.error(response);
                        reject(AuthError.Unknown);
                    } else {
                        // The type definition for TokenResponse is incorrect... it should be `scope` not `scopes`
                        const grantedScopes = (response as any).scope.split(" ") as GoogleAuthScope[];
                        setAuthedScopes(new Set(grantedScopes));
                        resolve(response);
                    }
                },
                error_callback: (error) => {
                    setIsPending(false);
                    switch (error.type) {
                        case "popup_failed_to_open":
                            reject(AuthError.PopupBlocked);
                            break;
                        case "popup_closed":
                            break;
                        case "unknown":
                        default:
                            reject(AuthError.Unknown);
                    }
                }
            });
            tokenClient.requestAccessToken();
        });


    }, [areApisLoaded]);

    /**
     * Revokes all authorizations that the current user has granted to the app.  Does nothing if no user is authorized
     * currently.
     */
    const revokeAuth = useCallback(() => {
        if (!areApisLoaded) {
            throw new Error("Google APIs not loaded yet");
        }

        const token = gapi.client.getToken();
        if (token !== null) {
            google.accounts.oauth2.revoke(token.access_token, () => undefined);
            gapi.client.setToken(null);
        }
        setAuthedScopes(new Set());
    }, [areApisLoaded]);

    return {
        authedScopes,
        isPending,
        startAuthFlow,
        revokeAuth
    };
}
