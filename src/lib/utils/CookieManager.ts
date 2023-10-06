export type Cookie = {
  name: string;
  durationInMs: number;
};
export type CookieState = Cookie & {
  activated: boolean;
};

type CookieContent = {
  date: Date;
  cookies: Array<CookieState>;
};

export class CookieManager {
  private content: CookieContent | undefined = undefined;

  constructor(private name: string, private cookieProvider: Array<Cookie>) {}

  public isActive = (name: string) => {
    const cookies = this.load()?.cookies;
    if(process.env.NODE_ENV !== 'production' && typeof cookies === 'undefined'){
        console.warn('isActive: missing cookie content')
        return false;
    }
    const found = cookies.find(c => c?.name === name);
    if(process.env.NODE_ENV !== 'production' && typeof found === 'undefined'){
        console.warn('isActive: cookie with name "'+name+'" not found')
    }
    return found?.activated ?? false;
  }

  public save = (cookiesMap: Record<string, boolean>): void => {
    const cookies: Array<CookieState> = this.cookieProvider.map((cookie) => {
      const activated = cookiesMap[cookie.name];
      if (typeof activated === "undefined") {
        console.warn("Missing cookie", cookie.name);
      }
      return { ...cookie, activated: activated ?? false };
    });

    this.setCookie(this.name, JSON.stringify({ date: new Date(), cookies }));
  };

  public load = (): CookieContent | undefined => {
    const cookieRawContent = this.getCookie(this.name);
    if (typeof cookieRawContent !== "undefined") {
      return JSON.parse(cookieRawContent);
    }
    return undefined;
  };

  public remove = (): void => {
    this.setCookie(this.name, '', new Date());
  };
  
  protected setCookie = (
    cname: string,
    value: string,
    expires?: Date
  ): void => {
    const cookie = `${cname}=${encodeURIComponent(value)};`;
    if (expires) {
      document.cookie = `${cookie}expires=${expires.toUTCString()};`;
      return;
    }
    document.cookie = cookie;
  };

  protected getCookie = (cname: string): string | undefined => {
    const name = `${cname}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return undefined;
  };
}
