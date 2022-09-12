export const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    else return null;
  };
  
  export const setCookie = (cname: string, cvalue: string) => {
    document.cookie = cname + "=" + cvalue + ";path=/";
  };
  