import { DownloadIcon, UpdateIcon, UploadIcon } from "@radix-ui/react-icons";
import {
  Flex,
  Text,
  Button,
  Container,
  Heading,
  Table,
  Link,
} from "@radix-ui/themes";
import { useCallback, useRef, useState, type ChangeEvent } from "react";
import toast from "react-hot-toast";
import { convertToMarkdown } from "./python";

const mimeTypePPTX =
  "application/vnd.openxmlformats-officedocument.presentationml.presentation";
const mimeTypeDOCX =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const mimeTypePDF = "application/pdf";
const mimeTypeHTML = "text/html";
const mimeTypeCSV = "text/csv";

export function Converter() {
  return (
    <Container>
      <ConvertForm />
    </Container>
  );
}

const toastStyle = {
  borderRadius: "10px",
  background: "#333",
  color: "#fff",
};

export default function ConvertForm() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<Array<File>>([]);
  const [convertedFiles, setConvertedFiles] = useState<Array<[string, Blob]>>(
    []
  );

  const [isConverting, setIsConverting] = useState(false);

  const onOpenFiles = useCallback(function btnClick() {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }, []);

  const onFileInputChange = useCallback(function onChange(
    e: ChangeEvent<HTMLInputElement>
  ) {
    if (e.target.files) {
      const newFiles = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        newFiles.push(file);
      }
      setFiles(newFiles);
    }
  },
  []);

  const convertFiles = useCallback(
    async function convert() {
      if (files.length <= 0) {
        return;
      }

      try {
        setIsConverting(true);

        const convertedFiles = await convertToMarkdown(files);
        setConvertedFiles(convertedFiles);
        toast.success("Files converted successfully!", {
          style: toastStyle,
          duration: 3000,
        });
      } catch (error: unknown) {
        console.log("Could not convert file", error);
        toast.error("Could not convert files. Pleasy try again later", {
          icon: "😰",
          style: toastStyle,
        });
      } finally {
        setIsConverting(false);
      }
    },
    [files]
  );

  const download = useCallback(function downloadConvertedFile(
    name: string,
    blob: Blob
  ) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
  []);

  return (
    <Flex direction="column" mt="9" px="4" gap="2">
      <input
        type="file"
        id="upload-input"
        ref={inputRef}
        multiple
        accept={`${mimeTypeCSV},${mimeTypeDOCX},${mimeTypeHTML},${mimeTypePDF},${mimeTypePPTX}`}
        style={{ visibility: "hidden" }}
        onChange={onFileInputChange}
      />
      <Flex direction={{ initial: 'column', md: 'row'}}>
        <Heading size="9">Convert anything to Markdown</Heading>
        <Flex direction="column" gap="2" mt='4'>
          <Text size="4" color="plum" highContrast weight="bold">
            Convert PDFs, HTML pages, DOCX and more to Markdown. All offline,
            directly on your browser.
          </Text>
          <Text size="2" color="plum">
            Built with ❤️ by{" "}
            <Link href="https://github.com/brunojppb">Bruno Paulino</Link> •
            Leave a star on{" "}
            <Link href="https://github.com/brunojppb/markitdown-ui/">
              Github
            </Link>
            .
          </Text>
        </Flex>
      </Flex>
      <Flex
        direction="column"
        justify="center"
        align="center"
        minHeight="100px"
      >
        <Button onClick={onOpenFiles} variant="outline" size="4">
          <UploadIcon /> Open files
        </Button>
      </Flex>
      {files.length > 0 && (
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Filename</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {files.map((file, index) => {
              const maybeBlob = convertedFiles.find(
                ([filename, _]) => filename === file.name
              );
              if (maybeBlob) {
                return (
                  <Table.Row key={`${file.name}-${index}`}>
                    <Table.RowHeaderCell>{file.name}</Table.RowHeaderCell>
                    <Table.Cell width="300px">
                      <Button
                        variant="soft"
                        onClick={(e) => {
                          e.preventDefault();
                          download(file.name, maybeBlob[1]);
                        }}
                      >
                        <DownloadIcon /> Download Markdown
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                );
              }
              return (
                <Table.Row key={`${file.name}-${index}`}>
                  <Table.RowHeaderCell>{file.name}</Table.RowHeaderCell>
                  <Table.Cell>Pending</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      )}

      <Flex justify="end" mt="4">
        <Button
          onClick={convertFiles}
          disabled={isConverting}
          loading={isConverting}
          style={{ visibility: files.length > 0 ? "inherit" : "hidden" }}
        >
          <UpdateIcon /> Convert files
        </Button>
      </Flex>
    </Flex>
  );
}
