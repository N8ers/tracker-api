declare namespace Express {
  export interface Request {
    user?: JwtPayload
  }
}

declare namespace NodeJE {
  interface ProcessEnv {
    ACCESS_TOKEN_SECRET?: string
    REFRESH_TOKEN_SECRET?: string
  }
}
