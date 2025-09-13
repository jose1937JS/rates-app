const unFormatPrice = (price: string) => {
    return Number(price.replace(/\,/g, ''));
}

const formatPrice = (price: number) => {
    if (isNaN(price)) return '';
    return price.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const formatDate = (dateString: string) => {
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.getMonth(); // Los meses van de 0 a 11
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day} ${monthNames[month]} ${hours}:${minutes}`;
}

export { formatPrice, unFormatPrice, formatDate };