Component({
    properties: {
      // 这里定义了innerText属性，属性值可以在组件使用时指定
      imgUrls: {
        type: Array,
        value: [
            '../../images/text-img.png',
            '../../images/text-img.png',
            '../../images/text-img.png'
          ],
      }
    },
    data: {
      // 这里是一些组件内部数据
      indicatorDots: false,
      autoplay: false,
      interval: 5000,
      duration: 250
    },
    methods: {
      // 这里是一个自定义方法
      customMethod() {}
    }
  })