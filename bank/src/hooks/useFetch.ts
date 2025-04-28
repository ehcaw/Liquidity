const useFetch = () => {
  const controller = new AbortController();
  const { signal } = controller;

  const fetchData = async <T>(
    url: string,
    options?: RequestInit,
  ): Promise<T | null> => {
    const response = await fetch(url, {
      ...options,
      signal,
    });

    if (response.status === 204) {
      return null;
    }
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    return data.data;
  };

  return {
    fetchData,
  };
};

export default useFetch;
