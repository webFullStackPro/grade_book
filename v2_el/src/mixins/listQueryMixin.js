// listQueryMixin.js
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export default {
  data () {
    return {
      initializeWhenCreated: true,
      initializeWhenMounted: true,
      // 查询参数默认值，可以根据实际情况调整
      queryParams: {
        page: 1,
        limit: 10
      },
      pageData: {
        loading: false, // 是否正在加载数据
        list: [], // 存储查询回来的数据
        count: 0,
        pageIndex: 1,
        pageSizes: [10, 20, 50],
        pageSize: 10
      },
      dialogWidth: '70%'
    }
  },
  mounted () {
    if (this.initializeWhenMounted) {
      this._getPageData()
    }
  },
  methods: {
    getPaginationParams () {
      const {
        pageIndex,
        pageSize
      } = this.pageData

      return {
        pageIndex,
        pageSize
      }
    },
    paginationChange (page) {
      this.pageData.pageIndex = page
      this._getPageData()
    },
    paginationSizeChange (pageSize) {
      this.pageData.pageSize = pageSize
      this._getPageData()
    },
    async _getPageData () {
      if (typeof this.getPageData !== 'function') {
        console.warn('method getPageData is required')
        return
      }
      const params = Object.assign(this.getPaginationParams(), this.searchParams)
      this.pageData.loading = true
      let resp
      try {
        resp = await this.getPageData(params)
      } catch (e) {
        console.error(e)
      }
      this.pageData.loading = false
      if (resp && resp.code === 1 && resp.data && resp.data.list.length) {
        this.pageData.list = resp.data.list
        this.pageData.count = resp.data.total
      } else {
        this.pageData.list = []
        this.pageData.count = 0
      }
    },
    getGenderText (gender) {
      return gender === 1 ? '男' : '女'
    },
    exportToExcel(headers, data) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sheet1');

      // 添加表头
      worksheet.addRow(headers);

      data.forEach(rowData => {
        worksheet.addRow(rowData);
      });

      // 设置列宽
      // worksheet.columns = [
      //   { width: 5 },
      //   { width: 15 },
      //   { width: 5 },
      //   { width: 15 },
      // ];

      // 将工作簿写入Buffer并转换为Blob对象，然后调用saveAs方法以触发浏览器下载
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'example.xlsx');
      }).catch((error) => {
        console.error('Error generating Excel file:', error);
      });
    }
  }
}
