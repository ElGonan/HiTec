// Once again, AI code cuz i was not going to do this xd

const transformDate = (date: string) => {
    const isoDate = date.replace(' ', 'T')
    const dateObj = new Date(isoDate)
    const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC'
}
    return dateObj.toLocaleString('es-MX', options)
}

export default transformDate