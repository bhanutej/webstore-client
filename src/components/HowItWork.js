import { Tabs, Row, Col } from 'antd';

export const HowItWork = () => {
  return <>
    <div className="how-it-work-title">
      <p>You know how it work?</p>
    </div>
    <div className="how-it-work-tab-container">
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Tab 1" key="1">
          <Row gutter={8}>
            <Col span={12} className="work-image-container" />
            <Col span={12}>"Sed ut perspiciatis unde omnis iste natus error sit vol ptatem accusantium dol oremque lautium,totam rem ape riam, eaque ipsa quae ab illo inventore veritatis et quasi ed ut perspiciatis unde omnis iste natus error sit volu ptatem accusanti um doloremque lautium,totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi et quasi ed ut perspiciatis unde omnis iste natus error sit volu ptatem accusanti um dol o r emque lautium,totam rem aperiam, eaque ipsa quae ab illo inventore</Col>
          </Row>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Tab 2" key="2">
          <Row gutter={8}>
            <Col span={12} className="work-image-container" />
            <Col span={12}>"Sed ut perspiciatis unde omnis iste natus error sit vol ptatem accusantium dol oremque lautium,totam rem ape riam, eaque ipsa quae ab illo inventore veritatis et quasi ed ut perspiciatis unde omnis iste natus error sit volu ptatem accusanti um doloremque lautium,totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi et quasi ed ut perspiciatis unde omnis iste natus error sit volu ptatem accusanti um dol o r emque lautium,totam rem aperiam, eaque ipsa quae ab illo inventore</Col>
          </Row>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Tab 3" key="3">
          <Row gutter={8}>
            <Col span={12} className="work-image-container" />
            <Col span={12}>"Sed ut perspiciatis unde omnis iste natus error sit vol ptatem accusantium dol oremque lautium,totam rem ape riam, eaque ipsa quae ab illo inventore veritatis et quasi ed ut perspiciatis unde omnis iste natus error sit volu ptatem accusanti um doloremque lautium,totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi et quasi ed ut perspiciatis unde omnis iste natus error sit volu ptatem accusanti um dol o r emque lautium,totam rem aperiam, eaque ipsa quae ab illo inventore</Col>
          </Row>
        </Tabs.TabPane>
      </Tabs>
    </div>
  </>
}