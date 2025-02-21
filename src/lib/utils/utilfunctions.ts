// /lib/utils.ts

export function numberToWords(number: number): string {
  const units = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];

  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  function convertLessThanThousand(num: number): string {
    if (num === 0) return "";

    if (num < 20) return units[num];

    if (num < 100) {
      return (
        tens[Math.floor(num / 10)] + (num % 10 ? " " + units[num % 10] : "")
      );
    }

    return (
      units[Math.floor(num / 100)] +
      " hundred" +
      (num % 100 ? " and " + convertLessThanThousand(num % 100) : "")
    );
  }

  if (number === 0) return "zero";

  // Handle decimals
  const [rupees, paise] = number.toFixed(2).split(".");
  let rupeesInWords = "";
  const num = parseInt(rupees);

  if (num < 1000) {
    rupeesInWords = convertLessThanThousand(num);
  } else if (num < 100000) {
    // Less than 1 lakh
    const thousands = Math.floor(num / 1000);
    const remainder = num % 1000;
    rupeesInWords =
      convertLessThanThousand(thousands) +
      " thousand" +
      (remainder ? " " + convertLessThanThousand(remainder) : "");
  } else if (num < 10000000) {
    // Less than 1 crore
    const lakhs = Math.floor(num / 100000);
    const remainder = num % 100000;
    rupeesInWords =
      convertLessThanThousand(lakhs) +
      " lakh" +
      (remainder ? " " + numberToWords(remainder) : "");
  }

  // Handle paise if present and not zero
  if (parseInt(paise) > 0) {
    return (
      rupeesInWords.charAt(0).toUpperCase() +
      rupeesInWords.slice(1) +
      " rupees and " +
      convertLessThanThousand(parseInt(paise)) +
      " paise"
    );
  }

  return rupeesInWords.charAt(0).toUpperCase() + rupeesInWords.slice(1);
}
