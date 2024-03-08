export default {
  fetch: async <T = any>({
    url = "/",
    body,
    method = "GET",
  }: {
    url?: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "DELETE";
    body?: { [x: string]: any };
  } = {}) => {
    try {
      const config = useRuntimeConfig();
      const data = await $fetch<T>(`${config.public.apiUrl}${url}`, {
        body,
        method,
      });

      return data;
    } catch (error) {
      console.log(error);
    }
  },
};
