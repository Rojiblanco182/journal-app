import axios from 'axios'
import cloudinary from 'cloudinary'
import uploadImage from '@/modules/daybook/helpers/uploadImage'

cloudinary.config({
  cloud_name: `${process.env.CLOUD_NAME}`,
  api_key: `${process.env.API_KEY}`,
  api_secret: `${process.env.API_SECRET}`
})

describe('uploadImage', () => {
  test('should load the selected image and return its URL once it has been uploaded', async (done) => {
    const selectedPic = `https://res.cloudinary.com/${process.env.CLOUD_NAME }/image/upload/v1549563711/folder-name/fondo.jpg.jpg`

    const { data } = await axios.get(selectedPic, {
      responseType: 'arraybuffer'
    })

    const file = new File([data], 'picture.jpg')
    const url = await uploadImage(file)

    const urlSegments = url.split('/')
    const imageId = urlSegments[urlSegments.length - 1].replace('.jpg', '')
     
    cloudinary.v2.api.delete_resources([imageId], {}, () => {
      done()
    })

    expect(typeof url).toBe('string')
  })
})
