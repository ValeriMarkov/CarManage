const carService = {

    fetchCars: async (user) => {
        const idToken = await user.getIdToken(true);
        const response = await fetch("https://localhost:7025/api/cars", {
            method: "GET",
            headers: { "Authorization": `Bearer ${idToken}` },
        });
        if (!response.ok) throw new Error("Failed to fetch cars");
        return response.json();
    },

    fetchCarDetails: async (user, carId) => {
        const idToken = await user.getIdToken(true);
        const response = await fetch(`https://localhost:7025/api/cars/${carId}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${idToken}` },
        });
        if (!response.ok) throw new Error("Failed to fetch car details");
        return response.json();
    },

    fetchServiceHistory: async (user, carId) => {
        const idToken = await user.getIdToken(true);
        const response = await fetch(`https://localhost:7025/api/cars/${carId}/services`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${idToken}` },
        });
        if (!response.ok) throw new Error("Failed to fetch service history");
        return response.json();
    },

    removeCar: async (user, carId) => {
        const idToken = await user.getIdToken(true);
        const response = await fetch(`https://localhost:7025/api/cars/${carId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${idToken}` },
        });
        if (!response.ok) throw new Error("Failed to remove car");
    },

    removeServiceHistory: async (user, carId, serviceHistoryId) => {
        const idToken = await user.getIdToken(true);
        const response = await fetch(`https://localhost:7025/api/cars/${carId}/services/${serviceHistoryId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${idToken}` },
        });
        if (!response.ok) throw new Error("Failed to remove service history");
    },
};

export default carService;
