const useFetch = () => {
  const controller = new AbortController();
  const { signal } = controller;

  const fetchData = async <T>(url: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(url, {
      ...options,
      signal,
    });

    const data = await response.json();
    if (!response.ok) {
      throw data.error;
    }
    return data.data;
  };

  return {
    fetchData,
  };
};

export default useFetch;
