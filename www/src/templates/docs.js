import React from 'react';

export default ({data}) => {
    const post = data.markdownRemark;
    return (
        <div>
            <div
                style={{
                    marginLeft: '300px',
                    background: '#01579b',
                    marginBottom: '1.45rem',
                    color: '#fff'
                }}
            >
                {' '}<div css={{width: '85%', margin: '0 auto'}}>
                    <h1 css={{padding: '20px 0'}}>
                        {post.frontmatter.title}
                    </h1>
                </div>
            </div>
            <div
                style={{
                    margin: '0 auto',
                    maxWidth: 960,
                    marginLeft: '300px',
                    paddingTop: 0
                }}
            >
                <div
                    css={{width: '85%', margin: '0 auto'}}
                    dangerouslySetInnerHTML={{__html: post.html}}
                />
            </div>
        </div>
    );
};

export const query = graphql`
    query DocsQuery($slug: String!) {
        markdownRemark(fields: {slug: {eq: $slug}}) {
            html
            frontmatter {
                title
            }
        }
    }
`;
