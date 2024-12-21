export function getTypeAsNumber(): number | null {
  const typeString = sessionStorage.getItem('type');

  if (typeString === null || typeString.trim() === '') {
    console.warn("'type' is not set in sessionStorage or it's empty.");
    return null;
  }

  const typeNumber = Number(typeString);

  if (isNaN(typeNumber)) {
    console.error("The value of 'type' is not a valid number.");
    return null;
  }

  return typeNumber;
}
