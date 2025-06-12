export async function getData() {
    return fetch('http://social-net.duckdns.org//api/info', {
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