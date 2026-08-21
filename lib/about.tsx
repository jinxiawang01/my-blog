export function AboutMarkdownContent() {
  return (
    <div className="about-md">
      <p>
        Hi～我是Wang jinxia，目前是一名互联网产品经理，同时也对用户体验、交互设计领域比较感兴趣。
        这里主要是记录我在学习、生活、工作中的一些想法、思考和总结。
      </p>

      <section>
        <h2>工作经历</h2>
        <div className="about-table-wrap">
          <table>
            <thead>
              <tr>
                <th>公司&部门</th>
                <th>时间</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>昆仑万维——AI音乐&AI语音</td>
                <td>2025年5月——至今</td>
              </tr>
              <tr>
                <td>Alpha Mobile——Manly</td>
                <td>2023年8月——2025年5月</td>
              </tr>
              <tr>
                <td>百度——好看视频</td>
                <td>2022年4月——2022年8月</td>
              </tr>
              <tr>
                <td>京东——数据安全</td>
                <td>2021年9月——2022年2月</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>教育经历</h2>
        <div className="about-table-wrap">
          <table>
            <thead>
              <tr>
                <th>学校&学院</th>
                <th>时间</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>北京信息科技大学——计算机学院</td>
                <td>2019年9月——2023年7月</td>
              </tr>
              <tr>
                <td>北京邮电大学——民族教育学院</td>
                <td>2018年9月——2019年7月</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>联系我</h2>
        <p>微信 — gebixiaowango</p>
        <p>
          邮箱 — <a href="mailto:jinxiawang01@163.com">jinxiawang01@163.com</a>
        </p>
      </section>
    </div>
  )
}
