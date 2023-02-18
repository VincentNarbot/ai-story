import AWS from "aws-sdk";

const handler = (req, res) => {
  const { method } = req;

  switch (method) {
    case "POST":
      return handlePOST(req, res);

    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

const handlePOST = async (req, res) => {
  const body = req.body;
  const parsedBody = JSON.parse(body);

  const story = parsedBody.story;

  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  // geenerate audio from story using AWS Polly
  const polly = new AWS.Polly({
    signatureVersion: "v4",
    region: "us-east-1",
  });

  const params = {
    OutputFormat: "mp3",
    Text: story,
    TextType: "text",
    VoiceId: "Joanna",
  };

  try {
    const data = await polly.synthesizeSpeech(params).promise();

    const audio = data.AudioStream;

    res.status(200).json({ audio });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, message: "Error generating audio" });
  }
};

export default handler;
