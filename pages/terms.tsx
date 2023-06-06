import Head from "@/components/head"

export default function Terms() {
  return (
    <div className="mx-auto flex h-full max-w-prose flex-col gap-4 overflow-y-auto py-6 xl:py-12">
      <Head title="用户协议" />
      <h1>用户协议</h1>
      <p>
        一刻（以下简称“我们”）依据本协议为用户（以下简称“你”）提供<b>一刻 AI</b>服务。本协议对你和我们均具有法律约束力。
      </p>

      <div>
        <h4>一、本服务的功能</h4>
        <p>你可以使用本服务提供的所有能力。</p>
      </div>

      <div>
        <h4>二、责任范围及限制</h4>
        <p>
          你使用本服务得到的结果仅供参考，实际情况以官方为准。由你输入的内容在本平台产生的任何内容如涉及违法违规，责任由你承担。
        </p>
      </div>

      <div>
        <h4>三、隐私保护</h4>
        <p>
          我们重视对你隐私的保护，你的个人隐私信息将根据<a href="/privacy">《隐私政策》</a>受到保护与规范，详情请参阅
          <a href="/privacy">《隐私政策》</a>。
        </p>
      </div>

      <div>
        <h4>四、其他条款</h4>
        <p>4.1 本协议所有条款的标题仅为阅读方便，本身并无实际涵义，不能作为本协议涵义解释的依据。</p>
        <p>4.2 本协议条款无论因何种原因部分无效或不可执行，其余条款仍有效，对双方具有约束力。</p>
      </div>
    </div>
  )
}
