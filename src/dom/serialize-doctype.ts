/// <reference types="trusted-types"/>

const htmlEscape = (str: string | null): string => {
  if (!str)
    return '';

  let escaped: string = '';
  str.split('').forEach(char => {
    if (char == '&') {
      char = '&amp;';
    } else if (char == '\'') {
      char = '&#039;';
    } else if (char == '"') {
      char = '&quot;';
    } else if (char == '<') {
      char = '&lt;';
    } else if (char == '>') {
      char = '&gt;';
    }
    escaped += char;
  });

  return escaped;
}

// @ts-ignore
const createDocType = (ignored: string, doctype?: DocumentType | null): string => {
    if (!doctype)
      return '<html></html>';

    const name = htmlEscape(doctype.name);
    const internalSubset = htmlEscape(doctype.internalSubset);
    const publicId = doctype.publicId ? `"${htmlEscape(doctype.publicId)}"` : '';
    const systemId = doctype.systemId ? `"${htmlEscape(doctype.systemId)}"` : '';

    return `<!DOCTYPE ${name}${internalSubset}${publicId}${systemId}><html></html>`;
}

let doctypePolicy: TrustedTypePolicy;
if ((window as any).trustedTypes) {
  doctypePolicy = (window as any).trustedTypes.createPolicy('html2canvas', {
    createHTML: createDocType
  });
}

export const serializeDoctype = (doctype?: DocumentType | null): string | TrustedHTML => {
  if (doctypePolicy !== undefined) {
    return doctypePolicy.createHTML('', doctype);
  } else {
    return createDocType('', doctype);
  }
}
