import React, { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { DocumentView, Config } from "react-native-pdftron";
import { DocumentViewerProps } from "../App";

const DocumentViewer = ({ route, navigation }: DocumentViewerProps) => {
  const { document } = route.params;

  const [annotationData, setAnnotationData] = useState('')

  const viewerRef = useRef(null)

  useEffect(() => {
    if (annotationData) {
      // console.log(annotationData);
      
      const { id, pageNumber, rect: { x1, x2, y1, y2 } } = annotationData

      viewerRef
        .current
        .setPropertiesForAnnotation(id, pageNumber, {
          rect: { x1, x2, y1, y2 },
          contents: JSON.stringify({ ok: true, msg: 'Hello World !'})
        })
        .then(console.log('>>>>>>> success loaded!'))
        .catch(console.log('>>>>>>> failed loaded!'))
    }
  }, [annotationData])

  return (
    <DocumentView
      ref={viewerRef}
      document={document}
      showLeadingNavButton={true}
      leadingNavButtonIcon={
        Platform.OS === "ios"
          ? "ic_close_black_24px.png"
          : "ic_arrow_back_white_24dp"
      }
      onLeadingNavButtonPressed={() => navigation.goBack()}
      overrideBehavior={[Config.Actions.stickyNoteShowPopUp]}
      onBehaviorActivated={async ({ action, data }) => {
        try {
          if (action === Config.Actions.stickyNoteShowPopUp) {
            const xfdfCommand = await viewerRef.current.exportAnnotations()
            if (xfdfCommand.includes('LocationPin')) {
              setAnnotationData(data)
            }
          }
        } catch (error) {
          console.log('something worng.');
        }
      }}
    />
  );
};

export default DocumentViewer;
