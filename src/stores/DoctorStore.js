import { defineStore } from 'pinia';

export const useDoctorStore = defineStore('doctor', {
  state: () => ({
    list: [
      {
        id: 1,
        name: 'Dr. John Doe',
        specialization: 'Cardiology',
        image: 'https://i.pinimg.com/736x/85/56/99/8556991d254994e1a3ca1cf6c03ff534.jpg',
        yearOfExperience: 10,
        ratingAverage: 4.8,
      },

      {
        id: 2,
        name: 'Dr. John Doe',
        specialization: 'Cardiology',
        image: 'https://i.pinimg.com/736x/85/56/99/8556991d254994e1a3ca1cf6c03ff534.jpg',
        yearOfExperience: 10,
        ratingAverage: 4.8,
      },

      {
        id: 3,
        name: 'Dr. John Doe',
        specialization: 'Cardiology',
        image: 'https://i.pinimg.com/736x/85/56/99/8556991d254994e1a3ca1cf6c03ff534.jpg',
        yearOfExperience: 10,
        ratingAverage: 3.5,
      },

      {
        id: 3,
        name: 'Dr. John Doe',
        specialization: 'Cardiology',
        image: 'https://i.pinimg.com/736x/85/56/99/8556991d254994e1a3ca1cf6c03ff534.jpg',
        yearOfExperience: 10,
        ratingAverage: 3.5,
      },
      {
        id: 3,
        name: 'Dr. John Doe',
        specialization: 'Cardiology',
        image: 'https://i.pinimg.com/736x/85/56/99/8556991d254994e1a3ca1cf6c03ff534.jpg',
        yearOfExperience: 10,
        ratingAverage: 3.5,
      },
      {
        id: 3,
        name: 'Dr. John Doe',
        specialization: 'Cardiology',
        image: 'https://i.pinimg.com/736x/85/56/99/8556991d254994e1a3ca1cf6c03ff534.jpg',
        yearOfExperience: 10,
        ratingAverage: 3.5,
      },
      {
        id: 3,
        name: 'Dr. John Doe',
        specialization: 'Cardiology',
        image: 'https://i.pinimg.com/736x/85/56/99/8556991d254994e1a3ca1cf6c03ff534.jpg',
        yearOfExperience: 10,
        ratingAverage: 3.5,
      },
    ],
  }),
  getters: {
    getDoctorByRating: state => {
      return state.list.filter(doctor => doctor.ratingAverage >= 4.5);
    },
    getAll: state => state.list,
    getById: state => id => state.list.find(d => d.id === id),
  },
});
