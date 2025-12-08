package middleware

import "net/http"

func CORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		// If request came through nginx (which sets CORS on the edge), do not duplicate
		if r.Header.Get("X-CORS") != "" {
			// Preflight fast-path if it still reaches here
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusNoContent)
				return
			}
			// Expose headers (safe to set unconditionally)
			w.Header().Set("Access-Control-Expose-Headers", "X-Log-Completed, X-Cluster-Id")
			next.ServeHTTP(w, r)
			return
		}

		// Direct API access (no nginx in front)
		origin := r.Header.Get("Origin")
		if origin != "" {
			// Echo Origin for credentials-compatible CORS
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Add("Vary", "Origin")
			w.Header().Set("Access-Control-Allow-Credentials", "true")
		} else {
			// No Origin (e.g., curl) — allow generic, but WITHOUT credentials
			w.Header().Set("Access-Control-Allow-Origin", "*")
			// Do not set Allow-Credentials with "*"
		}

		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PATCH, DELETE, PUT")
		w.Header().Set("Access-Control-Allow-Headers",
			"Authorization, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Origin, Accept, "+
				"X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, X-Auth-Token")
		w.Header().Set("Access-Control-Expose-Headers", "X-Log-Completed, X-Cluster-Id")

		// Preflight fast-path
		if r.Method == http.MethodOptions {
			w.Header().Set("Access-Control-Max-Age", "86400") // 1 day
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
