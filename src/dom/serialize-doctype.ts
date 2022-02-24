/// <reference types="trusted-types"/>

const htmlEscape = (str: string | null): string => {
  if (!str)
    return '';

  const escaped = [];
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
    escaped.push(char);
  });

  return escaped.join('');
}

const docRule: TrustedTypePolicyOptions = {
  createHTML: (ignored: string, doctype?: DocumentType | null): string => {
    if (!doctype)
      return '<html></html>';

    const name = htmlEscape(doctype.name);
    const internalSubset = htmlEscape(doctype.internalSubset);
    const publicId = `"${htmlEscape(doctype.publicId)}"`;
    const systemId = `"${htmlEscape(doctype.systemId)}"`;
    
    return `<!DOCTYPE ${name}${internalSubset}${publicId}${systemId}><html></html>`;
  }
}

let doctypePolicy: TrustedTypePolicy | TrustedTypePolicyOptions;
if ((window as any).trustedTypes) {
  doctypePolicy = (window as any).trustedTypes.createPolicy('html2canvas', docRule);
} else {
  doctypePolicy = docRule;
}

export const serializeDoctype = (doctype?: DocumentType | null): string => {
  doctypePolicy.createHTML('', doctype);
}
