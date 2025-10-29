import { defineStore } from 'pinia';

export const useSpecializationStore = defineStore('specialization', {
  state: () => ({
    list: [
      {
        id: 'dh',
        name: 'Tim mạch',
        image: 'src/assets/images/specilization/Cardiolody.png',
        symptom: 'Đau thắt tim, đau quặn ở phần ngực trái, thường xuyên mệt khi vận động nhẹ',
        description:
          'Chuyên khoa tim mạch chuyên điều trị các bệnh liên quan đến tim và hệ tuần hoàn, bao gồm các vấn đề như bệnh động mạch vành, suy tim, rối loạn nhịp tim, và cao huyết áp. Các bác sĩ tim mạch sử dụng các phương pháp chẩn đoán hiện đại như siêu âm tim, điện tâm đồ, và chụp mạch để đánh giá tình trạng tim mạch của bệnh nhân. Họ cũng cung cấp các phương pháp điều trị bao gồm thay đổi lối sống, thuốc',
      },

      {
        id: 'dn',
        name: 'Thần kinh',
        image: 'src/assets/images/specilization/Neurology.png',
        symptom: 'Đau đầu, chóng mặt, mất cảm giác ở tay chân, khó nói',
        description:
          'Chuyên khoa thần kinh chuyên điều trị các bệnh liên quan đến hệ thần kinh, bao gồm các vấn đề như đau đầu, chóng mặt, mất cảm giác, và rối loạn vận động. Các bác sĩ thần kinh sử dụng các phương pháp chẩn đoán hiện đại như chụp MRI, điện não đồ, và xét nghiệm dịch não tủy để đánh giá tình trạng hệ thần kinh của bệnh nhân. Họ cũng cung cấp các phương pháp điều trị bao gồm thuốc, vật lý trị liệu, và can thiệp phẫu thuật nếu cần thiết.',
      },

      {
        id: 'th',
        name: 'Tiêu hóa',
        image: 'src/assets/images/specilization/Gastroenterology.png',
        symptom: 'Đau bụng, buồn nôn, khó tiêu',
        description:
          'Chuyên khoa tiêu hóa chuyên điều trị các bệnh liên quan đến hệ tiêu hóa, bao gồm viêm dạ dày, viêm ruột, trào ngược dạ dày thực quản và ung thư đại trực tràng.',
      },

      {
        id: 'ct',
        name: 'Chấn thương chỉnh hình',
        image: 'src/assets/images/specilization/Orthopedics.png',
        symptom: 'Đau khớp, gãy xương, thoái hóa khớp',
        description:
          'Chuyên khoa chấn thương chỉnh hình điều trị các vấn đề về xương, khớp, cơ, gân và dây chằng.',
      },

      {
        id: 'dl',
        name: 'Da liễu',
        image: 'src/assets/images/specilization/Dermatology.jpg',
        symptom: 'Mụn, viêm da, ngứa, nổi mẩn',
        description:
          'Chuyên khoa da liễu chuyên điều trị các bệnh liên quan đến da, bao gồm các vấn đề như mụn trứng cá, eczema, vảy nến, và ung thư da. Các bác sĩ da liễu sử dụng các phương pháp chẩn đoán hiện đại như sinh thiết da, nội soi da, và xét nghiệm máu để đánh giá tình trạng da của bệnh nhân. Họ cũng cung cấp các phương pháp điều trị bao gồm thuốc bôi, thuốc uống, và can thiệp phẫu thuật nếu cần thiết.',
      },

      {
        id: 'ns',
        name: 'Nhi - sản phụ khoa',
        image: 'src/assets/images/specilization/Obstetrics.png',
        symptom: 'Sốt, ho, khó thở, nôn ói',
        description:
          'Chuyên khoa nhi - sản phụ khoa chuyên điều trị các bệnh liên quan đến trẻ em và phụ nữ mang thai, bao gồm các vấn đề như sinh non, dị tật bẩm sinh, và các bệnh lý phụ khoa. Các bác sĩ nhi - sản phụ khoa sử dụng các phương pháp chẩn đoán hiện đại như siêu âm, xét nghiệm máu, và nội soi để đánh giá tình trạng sức khỏe của bệnh nhân. Họ cũng cung cấp các phương pháp điều trị bao gồm thuốc, phẫu thuật, và can thiệp y tế nếu cần thiết.',
      },

      {
        id: 'nk',
        name: 'Nội khoa',
        image: 'src/assets/images/specilization/InternalMedicine.png',
        symptom: 'Đau bụng, sốt, mệt mỏi',
        description:
          'Chuyên khoa nội khoa chuyên điều trị các bệnh lý nội khoa, bao gồm các vấn đề về tiêu hóa, hô hấp, tim mạch và nội tiết. Các bác sĩ nội khoa sử dụng các phương pháp chẩn đoán hiện đại như xét nghiệm máu, siêu âm và nội soi để đánh giá tình trạng sức khỏe của bệnh nhân. Họ cũng cung cấp các phương pháp điều trị bao gồm thuốc, vật lý trị liệu và can thiệp y tế nếu cần thiết.',
      },
    ],
  }),
  getters: {
    getAll: state => state.list,
    getById: state => id => state.list.find(s => s.id === id),
  },
});

//trong trường hợp lấy dữ liệu từ server thì ta cần để list là một mảng trống
//và thêm trường action bên dưới vào

// actions: {
//     async fetchSpecializations() {
//       this.loading = true //cho biết là trạng thái đang tải dữ liệu xuống
//       this.error = null //lưu trữ thông báo lỗi nếu fetch dữ liệu thất bại
//       try {
//         const res = await axios.get('http://localhost:3000/api/specializations')
//         this.list = res.data // gán dữ liệu từ backend vào state
//       } catch (err) {
//         console.error('Lỗi fetch:', err)
//         this.error = err.message || 'Lỗi không xác định'
//       } finally {
//         this.loading = false
//       }
//     },
//   },
