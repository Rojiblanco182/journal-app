import axios from 'axios'

const uploadImage = async (file) => {
  if (!file) {
    return
  }

  try {
    const formData = new FormData()
    formData.append('upload_preset', 'vue-journal')
    formData.append('file', file)
    const url = `https://api.cloudinary.com/v1_1/${ process.env.CLOUD_NAME }/image/upload`

    const { data } = await axios.post(url, formData)

    return data.secure_url
  } catch (error) {
    console.error(error)
    return
  }
}

export default uploadImage
