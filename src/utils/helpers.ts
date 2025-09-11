const unFormatPrice = (price: string) => {
    return Number(price.replace(/\./g, '').replace(',', '.'));
}

const formatPrice = (price: number) => {
    if (isNaN(price)) return '';
    return price.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

export { formatPrice, unFormatPrice, formatDate };