
export const numberToWords = (num: number) => {
  const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
  const teens = ["", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  
  if (num === 0) return "Zero";
  
  const convertLessThanThousand = (n: number) => {
    if (n === 0) return "";
    else if (n < 10) return units[n];
    else if (n < 20) return teens[n - 10];
    else if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + units[n % 10] : "");
    else return units[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " " + convertLessThanThousand(n % 100) : "");
  };
  
  let result = "";
  if (num < 1000) {
    result = convertLessThanThousand(num);
  } else if (num < 100000) {
    result = convertLessThanThousand(Math.floor(num / 1000)) + " Thousand";
    if (num % 1000 !== 0) result += " " + convertLessThanThousand(num % 1000);
  }
  
  return result;
};
