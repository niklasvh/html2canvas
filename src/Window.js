/* @flow */
'use strict';

import type {Options} from './index';

import Logger from './Logger';

import {NodeParser} from './NodeParser';
import Renderer from './Renderer';
import ForeignObjectRenderer from './renderer/ForeignObjectRenderer';

import Feature from './Feature';
import {Bounds} from './Bounds';
import {cloneWindow, DocumentCloner} from './Clone';
import {FontMetrics} from './Font';
import Color, {TRANSPARENT} from './Color';

export const renderElement = (
    element: HTMLElement,
    options: Options,
    logger: Logger
): Promise<*> => {
    const ownerDocument = element.ownerDocument;

    const windowBounds = new Bounds(
        options.scrollX,
        options.scrollY,
        options.windowWidth,
        options.windowHeight
    );

    // http://www.w3.org/TR/css3-background/#special-backgrounds
    const documentBackgroundColor = ownerDocument.documentElement
        ? new Color(getComputedStyle(ownerDocument.documentElement).backgroundColor)
        : TRANSPARENT;
    const bodyBackgroundColor = ownerDocument.body
        ? new Color(getComputedStyle(ownerDocument.body).backgroundColor)
        : TRANSPARENT;

    const backgroundColor =
        element === ownerDocument.documentElement
            ? documentBackgroundColor.isTransparent()
              ? bodyBackgroundColor.isTransparent()
                ? options.backgroundColor ? new Color(options.backgroundColor) : null
                : bodyBackgroundColor
              : documentBackgroundColor
            : options.backgroundColor ? new Color(options.backgroundColor) : null;

    return (options.foreignObjectRendering
        ? // $FlowFixMe
          Feature.SUPPORT_FOREIGNOBJECT_DRAWING
        : Promise.resolve(false)).then(
        supportForeignObject =>
            supportForeignObject
                ? (cloner => {
                      if (__DEV__) {
                          logger.log(`Document cloned, using foreignObject rendering`);
                      }

                      return cloner
                          .inlineFonts(ownerDocument)
                          .then(() => cloner.resourceLoader.ready())
                          .then(() => {
                              const renderer = new ForeignObjectRenderer(cloner.documentElement);
                              return renderer.render({
                                  backgroundColor,
                                  logger,
                                  scale: options.scale,
                                  x: options.x,
                                  y: options.y,
                                  width: options.width,
                                  height: options.height,
                                  windowWidth: options.windowWidth,
                                  windowHeight: options.windowHeight,
                                  scrollX: options.scrollX,
                                  scrollY: options.scrollY
                              });
                          });
                  })(new DocumentCloner(element, options, logger, true, renderElement))
                : cloneWindow(
                      ownerDocument,
                      windowBounds,
                      element,
                      options,
                      logger,
                      renderElement
                  ).then(([container, clonedElement, resourceLoader]) => {
                      if (__DEV__) {
                          logger.log(`Document cloned, using computed rendering`);
                      }

                      const stack = NodeParser(clonedElement, resourceLoader, logger);
                      const clonedDocument = clonedElement.ownerDocument;

                      if (backgroundColor === stack.container.style.background.backgroundColor) {
                          stack.container.style.background.backgroundColor = TRANSPARENT;
                      }

                      return resourceLoader.ready().then(imageStore => {
                          if (options.removeContainer === true) {
                              if (container.parentNode) {
                                  container.parentNode.removeChild(container);
                              } else if (__DEV__) {
                                  logger.log(
                                      `Cannot detach cloned iframe as it is not in the DOM anymore`
                                  );
                              }
                          }

                          const fontMetrics = new FontMetrics(clonedDocument);
                          if (__DEV__) {
                              logger.log(`Starting renderer`);
                          }

                          const renderOptions = {
                              backgroundColor,
                              fontMetrics,
                              imageStore,
                              logger,
                              scale: options.scale,
                              x: options.x,
                              y: options.y,
                              width: options.width,
                              height: options.height
                          };

                          if (Array.isArray(options.target)) {
                              return Promise.all(
                                  options.target.map(target => {
                                      const renderer = new Renderer(target, renderOptions);
                                      return renderer.render(stack);
                                  })
                              );
                          } else {
                              const renderer = new Renderer(options.target, renderOptions);
                              return renderer.render(stack);
                          }
                      });
                  })
    );
};
