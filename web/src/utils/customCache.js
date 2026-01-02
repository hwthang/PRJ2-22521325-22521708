class CustomCache {
  myAccount = {
    set: (data) => {
      const storedString = JSON.stringify({ ...data });
      localStorage.setItem("my_account", storedString);
      console.log("CACHE: My account is stored: ", { ...data });
    },
    get: () => {
      const storedString = localStorage.getItem("my_account");
      const jsonData = JSON.parse(storedString);
      return { ...jsonData };
    },
    clear: () => {
      localStorage.removeItem("my_account");
    },
  };
}

export default new CustomCache();
