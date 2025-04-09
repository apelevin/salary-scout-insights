
/**
 * Reads the content of a file as a string
 * @param file The file to read
 * @returns A promise that resolves with the file content as string
 */
export const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error("Не удалось прочитать файл"));
      }
    };
    reader.onerror = () => {
      reject(new Error("Ошибка при чтении файла"));
    };
    reader.readAsText(file);
  });
};
