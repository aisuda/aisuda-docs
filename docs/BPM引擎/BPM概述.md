# 概述

BPM引擎是爱速搭基于BPM2.0规范，自研的业务流程引擎，场景覆盖审批流程场景、业务流程的场景。

# BPM2.0简介

**BPMN2.0发展历史**

BPMN最初由业务流程管理计划(BPMI)于2004年开发。2005年BPMI与对象管理组(OMG)合并。一年后，BPMN被OMG正式采纳为标准。BPMN2.0于2010年开发，但直到2013年才发布。该标准于同年由国际标准化组织(ISO)正式发布——ISO/IEC19510。

**BPMN2.0的用途和好处**

BPMN2.0用于构建易于遵循的业务流程模型流程图。与其他业务流程建模工具一样，BPMN2.0通过一种普遍理解的语言帮助利益相关者更好地理解流程。业务流程中涉及的步骤的可视化表示使业务用户可以轻松了解流程的工作方式。在技术层面，BPMN2.0提供了足够的细节来实现流程。

BPMN2.0还有助于缩小业务流程管理各个阶段之间的差距，从而更轻松地从业务流程设计转向实施。这主要是由于BPMN2.0提供的直观理解水平，使服务不同功能的利益相关者能够协同工作。

BPMN2.0相对于其他业务流程建模工具的另一个主要优势是，利用BPMN2.0的业务流程图可以通过基于XML的BPMN格式无缝转换为流程模型。

# 基本概念

业务流程主要由事件、活动、网关、顺序流组成。其中事件、活动、网关在BPMN2.0中也被称为流对象。

![:Users:zhangxuming01:Library:Application Support:typora-user-images:image-20220920095445317.png](/img/BPM引擎/BPM概述/image-20220920095445317_1f2f9b5.png)

| 要素 | 说明                                                         |
| ------ | ------------------------------------------------------------ |
| 事件   | 事件扮演着流程触发器的角色，通过事件可以完成触发流程的启动、暂停、终止等 |
| 活动   | 即相关的业务活动，包含人工活动（如人工审批活动）和服务活动（级后端自动执行的活动） |
| 网关   | 即决策节点，通过网关可以判断不同后续分支的执行策略和分支等待汇聚策略。  |
| 顺序流   | 显示将执行活动的顺序，可以理解为连线 |

# 事件

事件用来表明流程的生命周期中发生了什么事。事件总是画成一个圆圈， 在BPMN 2.0中事件有两大分类：

- 捕获（Catching）事件。当流程执行到该事件, 它会中断执行，等待被触发，如图中延时节点，抛出一个定时器，等待计时到期后，触发流程继续执行。
- 抛出（Throwing)）事件。当流程执行到该事件, 抛出一个结果

![:Users:zhangxuming01:Library:Application Support:typora-user-images:image-20220920100958989.png](/img/BPM引擎/BPM概述/image-20220920100958989_4dc0993.png)

<table>
  <thead>
    <tr>
      <th>分类</th><th>节点类型</th><th>简要说明</th>
    </tr>
  </thead>
  <tbody>
   <tr>
      <td rowSpan="4"> 开始类事件 </td>
      <td> 开始事件 </td>
      <td> 常规的开始事件，不指定事件的起因，支持人工、API触发。 </td>
   </tr>
   <tr>
      <td> 定时开始 </td>
      <td> 定时开始事件用来在指定的时间启动一个流程，也可以在指定周期内循环启动多次流程，例如每月1号凌晨2点开始启动账务结算处理流程。 </td>
   </tr>
   <tr>
      <td> 实体事件开始 </td>
      <td> 当接收到特定的实体事件时该流程被触发，例如指定实体的增删改事件后，触发当前流程。 </td>
   </tr>
    <tr>
      <td> 外部http触发 </td>
      <td> 由外部http节点触发。 </td>
   </tr>
   <tr>
      <td> 中间类事件 </td>
      <td> 延时节点 </td>
      <td> 当执行到达【延时节点】时中断在这里，引擎会创建一个定时器，当定时器触发后事件结束，流程沿后继路线继续执行。 </td>
   </tr>
   <tr>
      <td rowspan="2"> 结束类事件 </td>
      <td> 结束事件 </td>
      <td> 表示流程或分支的自然结束，什么都不做。当流程有多个分支路线被激活时，最后一个分支自然结束后，流程实例结束。 </td>
   </tr>
   <tr>
      <td> 终止事件 </td>
      <td> 表示流程被强制终止，什么都不做。当流程有多个分支路线被激活时，这些分支上的活动任务也被终止。 </td>
   </tr>
  
 
  </tbody>
</table>




# 活动

即流程中执行的任务，包含人工活动、自动活动。

- 人工活动：需要人员参与的任务，一般包含任务处理人、任务详情页等。

- 自动活动：无需人员参与的任务，由后端自动执行，也称之为自动任务。

<table>
   <thead>
      <tr>
         <th>分类</th>
         <th>活动名称</th>
         <th>说明</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td rowSpan="3">人工活动</td>
         <td>填写节点</td>
         <td>即人工填写指定表单，流程流转到该节点，会创建一个流程待办，由任务执行者进行填写任务。</td>
      </tr>
      <tr>
         <td>审批节点</td>
         <td>即人工审批节点，流程流转到该节点，会创建一个人工审批待办，可在待办中心访问，由任务执行者执行审批任务</td>
      </tr>
      <tr>
         <td>知会节点</td>
         <td>即知会指定人员，流程流转到该节点，被知会人员会收到一条知会任务，可在待办中心访问查看</td>
      </tr>
      <tr>
         <td rowSpan="6">自动活动</td>
         <td>提交记录</td>
         <td>针对当前流程中的临时数据，提交到对应的实体中，也就是入库</td>
      </tr>
      <tr>
         <td>新增记录</td>
         <td>在实体表单中新增一条、批量新增多条记录</td>
      </tr>
      <tr>
         <td>删除记录</td>
         <td>在实体表单中删除一条、批量删除多条记录</td>
      </tr>
      <tr>
         <td>更新记录</td>
         <td>更新实体中的指定记录，包含更新实体记录字段、批量更新实体记录</td>
      </tr>
      <tr>
         <td>查询记录</td>
         <td>据条件查询平台对象的实例记录，类似于数据库中的SELECT命令</td>
      </tr>
      <tr>
         <td>调用服务</td>
         <td>调用API及服务编</td>
      </tr>
   </tbody>
</table>

# 网关

网关即流程中的决策点，决定了流程分支执行、汇聚等待的规则。

| 网关名称 | 图标                                                         | 说明                                                         |
| -------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 排他网关 | ![image.png](/img/BPM引擎/BPM概述/image_49b871c.png) | 排他网关定义了一组分支的唯一决策，所有流出的分支被顺序评估，第一个条件被评估为true的分支被执行，并不再继续评估下面的分支 |
| 并行网关 | ![:Users:zhangxuming01:Library:Application Support:typora-user-images:image-20220920104352971.png](/img/BPM引擎/BPM概述/image-20220920104352971_b71ec7b.png) | 并行网关根据前置连线或后继连线，无条件创建分支或回收分支     |
| 包容网关 | ![:Users:zhangxuming01:Library:Application Support:typora-user-images:image-20220920104410911.png](/img/BPM引擎/BPM概述/image-20220920104410911_136b57b.png) | 包容网关是排他网关和并行网关的综合体。当决策时，与排他网关所不同的是，所有条件为true的后继分支都会被执行 |

