import Head from "next/head";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { Input, Select, Button, Form, Space, Card, message } from "antd";
import { useState } from "react";
import request from "@/utils/request";
import { PlayCircleOutlined } from "@ant-design/icons";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [isLoading, setLoadingTo] = useState(false);
  const [isLoadingAudio, setLoadingAudioTo] = useState(false);

  const [story, setStoryTo] = useState(null);
  const [image, setImageTo] = useState(null);

  const onFinish = async (values) => {
    setLoadingTo(true);

    try {
      const response = await request("generate-story", {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (response) {
        setStoryTo(response.story);
        setImageTo(response.image);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoadingTo(false);
    }
  };

  const playStory = async () => {
    setLoadingAudioTo(true);

    try {
      const response = await request("play-story", {
        method: "POST",
        body: JSON.stringify({ story }),
      });

      if (response && response.audio) {
        const audioBuffer = response.audio;
        const audioContext = new AudioContext();
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
      }
    } catch (error) {
      console.log(error);
      message.error(error.message);
    } finally {
      setLoadingAudioTo(false);
    }
  };

  return (
    <>
      <Head>
        <title>AI Story Time</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <Space direction="vertical" size="large">
            <Card
              title="Write a story"
              style={{
                width: "500px",
                margin: "0 auto",
              }}
            >
              <Form onFinish={onFinish} layout="vertical" name="basic">
                <Form.Item label="What should we write about" name="type">
                  <Select placeholder="Select your story">
                    <Select.Option value="write a disney story">
                      write a disney story
                    </Select.Option>
                    <Select.Option value="write a scary story">
                      write a scary story
                    </Select.Option>
                    <Select.Option value="write a romance story">
                      write a romance story
                    </Select.Option>
                    <Select.Option value="write a comedy story">
                      write a comedy story
                    </Select.Option>
                    <Select.Option value="write a fantasy story">
                      write a fantasy story
                    </Select.Option>
                    <Select.Option value="write a mystery story">
                      write a mystery story
                    </Select.Option>
                    <Select.Option value="write a thriller story">
                      write a thriller story
                    </Select.Option>
                    <Select.Option value="write a sci-fi story">
                      write a sci-fi story
                    </Select.Option>
                    <Select.Option value="write a western story">
                      write a western story
                    </Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Plots of the story" name="plot">
                  <Input.TextArea placeholder="Rocky" showCount />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={isLoading}>
                    Generate my story
                  </Button>
                </Form.Item>
              </Form>
            </Card>

            {story && (
              <Card
                cover={image && <img src={image} alt="Your story" />}
                title="Your story"
                extra={
                  <Button
                    type="default"
                    onClick={() => {
                      playStory();
                    }}
                    loading={isLoadingAudio}
                  >
                    <PlayCircleOutlined /> Play story
                  </Button>
                }
              >
                <p>{story}</p>
              </Card>
            )}
          </Space>
        </div>
      </main>
    </>
  );
}
