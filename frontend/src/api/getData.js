export async function getData() {
    return fetch('http://20.56.138.63:8080//api/info', {
        method: 'GET',
        credentials: 'include',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return response.json();
    })
    .then(data => {
        console.log('Data fetched successfully:', data);
        return data;
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        throw error;
    });
}